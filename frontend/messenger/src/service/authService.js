import api from "./api";

export async function registerUser(name, email, password) {
const response = await api.post("/user/register", {
name,
email,
password,
});

return response.data;
}

export async function loginUser(email, password) {
const response = await api.post("/user/login", {
email,
password,
});

return response.data;
}
