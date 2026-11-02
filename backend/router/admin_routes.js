const admin_controller = require("../controller/admin_con");
const auth_middleware = require("../middleware/auth");
const role_middleware = require("../middleware/role");

async function admin_routes(fastify) {
// View all users
fastify.get("/users",{preHandler: [auth_middleware,role_middleware(["admin"])]},admin_controller.get_all_users_con);

// Find a user by email
fastify.get("/users/:email",{preHandler: [auth_middleware,role_middleware(["admin"])]},admin_controller.find_user_con);

// Change a user's role
fastify.patch("/users/role",{preHandler:[auth_middleware,role_middleware(["admin"])]},admin_controller.update_role_con);

// Delete a user
fastify.delete("/users/:email",{preHandler:[auth_middleware,role_middleware(["admin"])]},admin_controller.delete_user_con);
}

module.exports = admin_routes;
