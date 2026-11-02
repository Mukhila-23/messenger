const user_controller = require("../controller/user_con");
const auth_middleware = require("../middleware/auth");

async function user_routes(fastify) {

// Register a new user
fastify.post("/register", user_controller.register_con);

// Login an existing user
fastify.post("/login", user_controller.login_con);

// Google OAuth callback
fastify.get("/google/callback", user_controller.google_callback_con);

// Search for a registered user by email
fastify.get("/search",{ preHandler: auth_middleware },user_controller.find_user_by_email_con);
}

module.exports = user_routes
