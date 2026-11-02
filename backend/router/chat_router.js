const chat_controller = require("../controller/chat_controller");
const auth_middleware = require("../middleware/auth");

async function chat_routes(fastify) {
    fastify.post("/create",{preHandler: auth_middleware},chat_controller.create_chat_con);

    fastify.get("/my-chats",{ preHandler: auth_middleware},chat_controller.my_chats_con);

    fastify.delete("/:chat_id",{preHandler: auth_middleware},chat_controller.delete_chat_con);
}

module.exports = chat_routes;