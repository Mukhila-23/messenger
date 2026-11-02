import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { getMessages } from "../service/messageService";
import "../styles/chat.css";

export default function Chat() {
const location = useLocation();
const navigate = useNavigate();

const chat = location.state?.chat;
const otherUser = location.state?.otherUser;
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

const [messages, setMessages] = useState([]);
const [messageText, setMessageText] = useState("");
const [loading, setLoading] = useState(true);
const [sending, setSending] = useState(false);
const [error, setError] = useState("");

const bottomRef = useRef(null);
const socketRef = useRef(null);

// Turn a message date into a short label for the chat screen.
function getDateLabel(date) {
const messageDate = new Date(date);
const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

if (messageDate.toDateString() === today.toDateString()) return "Today";
if (messageDate.toDateString() === yesterday.toDateString()) return "Yesterday";

return messageDate.toLocaleDateString([], {
  day: "numeric",
  month: "short",
  year: "numeric",
});
}

// Redirect if the conversation details are missing
useEffect(() => {
if (!chat?._id || !otherUser) {
navigate("/home", { replace: true });
}
}, [chat, otherUser, navigate]);

// Load message history and establish the WebSocket connection
useEffect(() => {
if (!chat?._id) return;

let active = true;

async function loadMessages() {
  try {
    const data = await getMessages(chat._id);

    if (active) {
      setMessages(data);
      setError("");
    }
  } catch (err) {
    if (active) {
      setError(
        err.response?.data?.message || "Could not load messages."
      );
    }
  } finally {
    if (active) {
      setLoading(false);
    }
  }
}

// Load existing messages using HTTP
loadMessages();

// Get the JWT token saved during login
const token = localStorage.getItem("token");

if (!token) {
  const timer = setTimeout(() => setError("Please log in again."), 0);
  return () => {
    active = false;
    clearTimeout(timer);
  };
}

// Connect to the backend WebSocket endpoint
const socket = new WebSocket(
  `ws://localhost:3000/ws?token=${encodeURIComponent(token)}`
);

socketRef.current = socket;

// Receive messages broadcast by the backend
socket.onmessage = (event) => {
  if (!active) return;

  try {
    const data = JSON.parse(event.data);

    if (data.type === "new_message") {
      const incomingMessage = data.message;

      // Display only messages for the currently open conversation
      if (
        String(incomingMessage.chat_id) === String(chat._id)
      ) {
        setMessages((previousMessages) => {
          // Prevent duplicate messages
          const alreadyExists = previousMessages.some(
            (msg) =>
              String(msg._id) === String(incomingMessage._id)
          );

          if (alreadyExists) {
            return previousMessages;
          }

          return [...previousMessages, incomingMessage];
        });
      }
    }

    if (data.type === "error") {
      setError(data.message || "Could not send the message.");
    }
  } catch (err) {
    console.error("Could not process WebSocket message:", err);
  }
};

socket.onopen = () => {
  if (active) {
    console.log("WebSocket connected successfully.");
  }
};

socket.onerror = () => {
  if (active) {
    console.error("WebSocket connection error.");
    setError("WebSocket connection failed. Please try again.");
  }
};

socket.onclose = (event) => {
  if (active) {
    console.log("WebSocket connection closed.");
    console.log("Close code:", event.code);
    console.log("Close reason:", event.reason);
    console.log("Was connection clean:", event.wasClean);
  }
};

// Close the connection when leaving this conversation
return () => {
  active = false;

  socket.close();

  if (socketRef.current === socket) {
    socketRef.current = null;
  }
};

}, [chat?._id]);

// Scroll to the latest message when messages change
useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// Send a message through WebSocket
function handleSend(event) {
event.preventDefault();

const text = messageText.trim();
const socket = socketRef.current;

if (!text || sending || !chat?._id) {
  return;
}

if (!socket || socket.readyState !== WebSocket.OPEN) {
  setError("Connection is not ready. Please try again.");
  return;
}

setSending(true);
setError("");

try {
  socket.send(
    JSON.stringify({
      type: "send_message",
      chat_id: chat._id,
      message: text,
    })
  );

  setMessageText("");
} catch (err) {
  console.error("Could not send message:", err);
  setError("Could not send the message. Please try again.");
} finally {
  setSending(false);
}

}

if (!chat?._id || !otherUser) {
return ( <div className="chat-page"> <p>Opening conversation...</p> </div>
);
}

return ( <div className="chat-page"> <header className="chat-header">
<button
className="back-button"
onClick={() => navigate("/home")}
aria-label="Back to conversations"
> <ArrowLeft size={22} /> </button>
    <div className="chat-person">
      <div className="chat-avatar">
        {(otherUser.name || otherUser.email || "?")
          .charAt(0)
          .toUpperCase()}
      </div>

      <div>
        <h2>{otherUser.name || "User"}</h2>
        <p>{otherUser.email}</p>
      </div>
    </div>
  </header>

  <main className="messages-area">
    {loading ? (
      <p className="chat-status">Loading messages...</p>
    ) : messages.length === 0 ? (
      <div className="empty-chat">
        <div className="empty-chat-icon">💬</div>
        <h3>Start your conversation</h3>
        <p>Send your first message below.</p>
      </div>
    ) : (
      messages.map((msg, index) => {
        const isMine =
          String(msg.sender_id?._id || msg.sender_id) ===
          String(currentUser.id);
        const previousMessage = messages[index - 1];
        const showDate = !previousMessage ||
          new Date(previousMessage.created_at).toDateString() !==
          new Date(msg.created_at).toDateString();

        return (
          <div key={msg._id}>
            {showDate && <p className="date-label">{getDateLabel(msg.created_at)}</p>}
            <div className={`message-row ${isMine ? "mine" : "theirs"}`}>
              <div className="message-bubble">
                <p>{msg.message}</p>

                <span className="message-time">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })
    )}

    {error && <p className="chat-error">{error}</p>}

    <div ref={bottomRef} />
  </main>

  <form className="message-form" onSubmit={handleSend}>
    <input
      type="text"
      placeholder="Type a message..."
      value={messageText}
      onChange={(event) => setMessageText(event.target.value)}
      aria-label="Type a message"
      autoComplete="off"
    />

    <button
      type="submit"
      disabled={!messageText.trim() || sending}
      aria-label="Send message"
    >
      <Send size={20} />
    </button>
  </form>
</div>

);
}
