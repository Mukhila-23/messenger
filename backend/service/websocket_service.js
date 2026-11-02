const activeUsers = new Map();

function add_connection(user_id, socket) {
if (!activeUsers.has(user_id)) {
        activeUsers.set(user_id, new Set());
    }
activeUsers.get(user_id).add(socket);
console.log("User connected:", user_id);
}


function remove_connection(user_id, socket) {
const connections = activeUsers.get(user_id);
if (!connections)
{return;}
connections.delete(socket);
if (connections.size === 0) {
        activeUsers.delete(user_id);
    }
console.log("User disconnected:", user_id);
}


function send_to_user(user_id, data) {
const connections = activeUsers.get(user_id);
if (!connections)
{return;}
const message = JSON.stringify(data);
for (const socket of connections) {
    if (socket.readyState === 1) {
            socket.send(message);
        }
    }
}

module.exports = {add_connection,remove_connection,send_to_user };