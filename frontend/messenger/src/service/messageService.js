import api from "./api";

// Get the logged-in user's token
function getAuthHeaders() {
const token = localStorage.getItem("token");

return {
Authorization: `Bearer ${token}`,
};
}

// Send a message in a conversation
export async function sendMessage(chatId, message) {
const response = await api.post(
"/messages/send",
{
chat_id: chatId,
message: message,
},
{
headers: getAuthHeaders(),
}
);

return response.data;
}

// Get all messages in a conversation
export async function getMessages(chatId) {
const response = await api.get(
`/messages/${chatId}`,
{
headers: getAuthHeaders(),
}
);

return response.data.messages;
}
