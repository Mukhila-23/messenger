import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {MessageCircle,LogOut,UserRound,Mail,Search,Plus,LoaderCircle,Trash2} from "lucide-react";
import {getMyChats,searchUsers,createChat,deleteChat} from "../service/chatService";

function Home() {
const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user") || "null");

const [chats, setChats] = useState([]);
const [email, setEmail] = useState("");
const [searchedUser, setSearchedUser] = useState(null);
const [suggestions, setSuggestions] = useState([]);

const [loadingChats, setLoadingChats] = useState(true);
const [searching, setSearching] = useState(false);
const [startingChat, setStartingChat] = useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

// Load existing conversations
async function loadChats() {
try {
const data = await getMyChats();
setChats(data);
} catch (err) {
console.error("Load chats error:", err);
setError(err.response?.data?.message ||"Unable to load conversations.");
} finally {
  setLoadingChats(false);
}
}
useEffect(() => {
const timer = setTimeout(loadChats, 0);
return () => clearTimeout(timer);
}, []);

// Wait briefly after typing, then show matching people.
useEffect(() => {
const searchText = email.trim();

if (!searchText) {
  const timer = setTimeout(() => setSuggestions([]), 0);
  return () => clearTimeout(timer);
}

const timer = setTimeout(async () => {
  try {
    const users = await searchUsers(searchText);
    setSuggestions(users);
  } catch (err) {
    console.error("Suggestions error:", err);
    setSuggestions([]);
  }
}, 300);

return () => clearTimeout(timer);
}, [email]);

// Search for a contact using their email
async function handleSearch(event) {
event.preventDefault();
setError("");
setSuccess("");
setSearchedUser(null);

if (!email.trim()) {
  setError("Please enter an email address.");
  return;
}

try {
  setSearching(true);
  const users = await searchUsers(email.trim());
  if (users.length === 0) {
    setError("No matching user found.");
    return;
  }
  setSearchedUser(users[0]);
} catch (err) {
  console.error("Search user error:", err);

  setError(
    err.response?.data?.message ||
      "Unable to find this user."
  );
} finally {
  setSearching(false);
}

}

function chooseSuggestion(contact) {
setSearchedUser(contact);
setEmail(contact.email);
setSuggestions([]);
setError("");
}

async function handleDeleteChat(event, chatId) {
event.stopPropagation();

if (!window.confirm("Remove this conversation from your list?")) {
  return;
}

try {
  await deleteChat(chatId);
  setChats((currentChats) => currentChats.filter((chat) => chat._id !== chatId));
} catch (err) {
  setError(err.response?.data?.message || "Unable to delete the conversation.");
}
}

// Create a new conversation or reopen an existing one
async function handleStartChat() {
if (!searchedUser?._id) {
setError("Please search for a contact first.");
return;
}

setError("");
setSuccess("");

try {
  setStartingChat(true);

  await createChat(searchedUser._id);

  setSuccess(`Conversation with ${searchedUser.name} is ready.`);
  setEmail("");
  setSearchedUser(null);

  await loadChats();
} catch (err) {
  console.error("Create chat error:", err);

  setError(
    err.response?.data?.message ||
      "Unable to start the conversation."
  );
} finally {
  setStartingChat(false);
}

}

// Log out
function handleLogout() {
localStorage.removeItem("token");
localStorage.removeItem("user");

navigate("/login");

}

return (
<div
style={{
minHeight: "100vh",
background: "#f7f5fc",
padding: "30px",
fontFamily: "Segoe UI, Arial, sans-serif",
color: "#29243b",
}}
>
{/* Header */}
<header
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "16px",
flexWrap: "wrap",
marginBottom: "30px",
}}
>
<div style={{ display: "flex", alignItems: "center", gap: "12px" }}> <MessageCircle size={32} color="#8064d9" />
<h1 style={{ fontSize: "28px" }}>Messenger</h1> </div>
    <button
      onClick={handleLogout}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        borderRadius: "8px",
        background: "#8064d9",
        color: "#fff",
      }}
    >
      <LogOut size={17} />
      Logout
    </button>
  </header>

  {/* Current user */}
  <section
    style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(64,45,120,.08)",
      marginBottom: "25px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <UserRound size={36} color="#8064d9" />

      <div>
        <h2 style={{ fontSize: "20px", marginBottom: "6px" }}>
          Welcome, {user?.name || user?.full_name || "User"}!
        </h2>

        <p style={{ color: "#89849b" }}>
          {user?.email || "Your account"}
        </p>
      </div>
    </div>
  </section>

  {/* Search contacts */}
  <section
    style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(64,45,120,.08)",
      marginBottom: "25px",
    }}
  >
    <h2 style={{ marginBottom: "8px" }}>Find People</h2>

    <p
      style={{
        color: "#89849b",
        fontSize: "14px",
        marginBottom: "18px",
      }}
    >
      Enter a registered user's email address to start chatting.
    </p>

    <form
      onSubmit={handleSearch}
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flex: "1",
          minWidth: "220px",
          border: "1px solid #e9e5f2",
          borderRadius: "9px",
          padding: "0 12px",
        }}
      >
        <Mail size={19} color="#89849b" />

        <input
          type="email"
          placeholder="Enter contact's email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{
            flex: "1",
            minWidth: "0",
            padding: "13px 0",
            border: "none",
            outline: "none",
            background: "transparent",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={searching}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 20px",
          borderRadius: "9px",
          background: "#8064d9",
          color: "#fff",
          opacity: searching ? 0.7 : 1,
        }}
      >
        {searching ? (
          <LoaderCircle size={18} />
        ) : (
          <Search size={18} />
        )}

        {searching ? "Searching..." : "Search"}
      </button>
    </form>

    {suggestions.length > 0 && (
      <div style={{ border: "1px solid #e9e5f2", borderRadius: "9px", marginTop: "8px", overflow: "hidden" }}>
        {suggestions.map((contact) => (
          <button
            key={contact._id}
            type="button"
            onClick={() => chooseSuggestion(contact)}
            style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", background: "#fff", border: "none", borderBottom: "1px solid #f0edf6" }}
          >
            <strong>{contact.name}</strong> <span style={{ color: "#89849b" }}>({contact.email})</span>
          </button>
        ))}
      </div>
    )}

    {/* Search result */}
    {searchedUser && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "20px",
          padding: "16px",
          border: "1px solid #e9e5f2",
          borderRadius: "12px",
          background: "#faf9ff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              background: "#eee8ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserRound size={24} color="#8064d9" />
          </div>

          <div>
            <h3>
              {searchedUser.name ||
                searchedUser.full_name ||
                "Unknown user"}
            </h3>

            <p style={{ color: "#89849b", fontSize: "13px" }}>
              {searchedUser.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartChat}
          disabled={startingChat}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 16px",
            borderRadius: "9px",
            background: "#8064d9",
            color: "#fff",
            opacity: startingChat ? 0.7 : 1,
          }}
        >
          <Plus size={18} />
          {startingChat ? "Opening..." : "Start Chat"}
        </button>
      </div>
    )}

    {/* Feedback messages */}
    {error && (
      <p
        role="alert"
        style={{
          color: "#e05260",
          marginTop: "15px",
          fontSize: "14px",
        }}
      >
        {error}
      </p>
    )}

    {success && (
      <p
        role="status"
        style={{
          color: "#25865d",
          marginTop: "15px",
          fontSize: "14px",
        }}
      >
        {success}
      </p>
    )}
  </section>

  {/* Conversations */}
  <section
    style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "16px",
      minHeight: "250px",
      boxShadow: "0 8px 30px rgba(64,45,120,.08)",
    }}
  >
    <h2 style={{ marginBottom: "20px" }}>Your Conversations</h2>

    {loadingChats && (
      <p style={{ color: "#89849b" }}>
        Loading conversations...
      </p>
    )}

    {!loadingChats && chats.length === 0 && (
      <div style={{ textAlign: "center", padding: "25px" }}>
        <MessageCircle size={45} color="#8064d9" />

        <p style={{ marginTop: "15px", color: "#89849b" }}>
          No conversations yet. Search for someone to start chatting!
        </p>
      </div>
    )}

    {!loadingChats &&
      chats.map((chat) => {
        const contact = chat.other_user;

        return (
         <div
  key={chat._id}
  onClick={() => {
    console.log("Clicked conversation:", chat);
    navigate("/chat", {
      state: {
        chat: chat,
        otherUser: chat.other_user,
      },
    });
  }}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 8px",
    borderBottom: "1px solid #e9e5f2",
    cursor: "pointer",
  }}
>

            <div
              style={{
                width: "48px",
                height: "48px",
                minWidth: "48px",
                borderRadius: "50%",
                background: "#eee8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserRound size={25} color="#8064d9" />
            </div>

            <div style={{ flex: "1" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>
                {contact?.name ||
                  contact?.full_name ||
                  "Unknown contact"}
              </h3>

              <p style={{ color: "#89849b", fontSize: "13px" }}>
                {contact?.email || "Email unavailable"}
              </p>
            </div>

            <button
              type="button"
              onClick={(event) => handleDeleteChat(event, chat._id)}
              aria-label={`Delete chat with ${contact?.name || "user"}`}
              title="Delete chat"
              style={{ border: "none", background: "transparent", color: "#e05260", padding: "8px", cursor: "pointer" }}
            >
              <Trash2 size={19} />
            </button>
          </div>
        );
      })}
  </section>
</div>

);
}

export default Home;
