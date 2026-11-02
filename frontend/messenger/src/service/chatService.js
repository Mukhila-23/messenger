import api from "./api";

// Get all conversations of the logged-in user
export async function getMyChats() {
const token = localStorage.getItem("token");

const response = await api.get("/chat/my-chats", {
headers: {
Authorization: `Bearer ${token}`,
},
});

return response.data.chats;
}

// Search for registered users by name or email.
export async function searchUsers(query) {
const token = localStorage.getItem("token");

const response = await api.get("/user/search", {
params: { query },
headers: {
Authorization: `Bearer ${token}`,
},
});

return response.data.users;
}

// Create or open a conversation with another user
export async function createChat(userId) {
const token = localStorage.getItem("token");

const response = await api.post(
"/chat/create",
{ user_id: userId },
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

return response.data.chat;
}

// Remove a conversation from the current user's conversation list.
export async function deleteChat(chatId) {
const token = localStorage.getItem("token");

await api.delete(`/chat/${chatId}`, {
headers: {
Authorization: `Bearer ${token}`,
},
});
}
