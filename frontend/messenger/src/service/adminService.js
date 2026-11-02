import api from "./api";

// Get authentication token
function getAuthHeaders() {
const token = localStorage.getItem("token");

return {
Authorization: `Bearer ${token}`,
};
}

// Get all registered users
export async function getAllUsers() {
const response = await api.get("/admin/users", {
headers: getAuthHeaders(),
});

return response.data;
}

// Find a user by email
export async function findUser(email) {
const response = await api.get(
`/admin/users/${encodeURIComponent(email)}`,
{
headers: getAuthHeaders(),
}
);

return response.data;
}

// Change a user's role
export async function updateUserRole(email, role) {
const response = await api.patch("/admin/users/role",{email,role,},
{headers: getAuthHeaders(),});

return response.data;
}

// Delete a user
export async function deleteUser(email) {
const response = await api.delete(
`/admin/users/${encodeURIComponent(email)}`,
{
headers: getAuthHeaders(),
}
);

return response.data;
}
