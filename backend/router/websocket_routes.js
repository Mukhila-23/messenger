const { handle_message } = require("../controller/websocket_controller");
const {add_connection,remove_connection} = require("../service/websocket_service");

async function websocket_routes(fastify) {
    fastify.get("/ws", { websocket: true }, (socket, request) => {
        const token = request.query.token;
        if (!token) {
            socket.close(1008, "Token required");
            return;}

        let user;
        try {
            user = fastify.jwt.verify(token);
        } catch (error) {
            socket.close(1008, "Invalid token");
            return;
        }
        const user_id = user.userId || user.id || user.user_id || user._id;
        if (!user_id) {
             return;
        }
        const current_user = user_id.toString();
        add_connection(current_user, socket);
        socket.on("message", (data) => {
            handle_message(current_user, socket, data);
        });
        socket.on("close", (code, reason) => {
        console.log("WebSocket closed.");
        remove_connection(current_user, socket);
});
        socket.on("error", (error) => {
            fastify.log.error(error);
        });
    });
}

module.exports = websocket_routes;