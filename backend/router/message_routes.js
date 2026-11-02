const message_controller = require("../controller/message_controller");
const auth_middleware = require("../middleware/auth");

async function message_routes(fastify) {
    fastify.post("/send",{preHandler: auth_middleware},message_controller.send_message_con);

    fastify.get("/:chat_id",{preHandler: auth_middleware},message_controller.get_messages_con);
}

module.exports = message_routes;       