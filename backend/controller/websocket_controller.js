const { send_message_ser } = require("../service/message_service");
const { getdb } = require("../config/db");
const { send_to_user } = require("../service/websocket_service");

async function handle_message(user_id, socket, data) {
try {
        const received_data = JSON.parse(data.toString());
        if (received_data.type !== "send_message") {
            return;
        }
        const chat_id = received_data.chat_id;
        const message = received_data.message;
        if (typeof chat_id !== "string" ||typeof message !== "string" ||!message.trim()) {
            socket.send(JSON.stringify({
                type: "error",
                message: "Invalid chat ID or message"
            }));

            return;
        }
        const saved_message = await send_message_ser(chat_id,user_id,message);

        // Find the chat in MongoDB
        const chat = await getdb().collection("chats").findOne({_id: saved_message.chat_id});
        if (!chat) {
            return;
        }

        // Prepare the event to send to participants
        const response = {type: "new_message",message: saved_message};

        // Send the saved message to each chat participant
        for (const participant_id of chat.participants) {
                send_to_user(participant_id.toString(),response);
        }

    } catch (error) {
console.error("WebSocket message error:", error.message);
        if (socket.readyState === 1) {
            socket.send(JSON.stringify({
                type: "error",
                message: error.message || "Failed to send message"
            }));
        }
    }
}

module.exports = {
    handle_message
};