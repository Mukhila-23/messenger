const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const jwt = require("@fastify/jwt");
const oauthPlugin = require("@fastify/oauth2");
const websocket = require("@fastify/websocket");

const env = require("./config/env");

const user_routes = require("./router/user_routes");
const admin_routes = require("./router/admin_routes");
const chat_routes = require("./router/chat_router");
const message_routes = require("./router/message_routes");
const websocket_routes = require("./router/websocket_routes");

fastify.register(jwt, {secret: env.jwt_secret});
fastify.register(cors, {origin: true,methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]});
fastify.register(websocket);

// Google OAuth configuration
fastify.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
        client: {
            id: env.google_client_id,
            secret: env.google_client_secret
        },
        auth: oauthPlugin.GOOGLE_CONFIGURATION
    },
    startRedirectPath: "/user/google",
    callbackUri: env.google_callback_url,
    pkce:"S256"
});

fastify.register(user_routes, {prefix: "/user"});
fastify.register(admin_routes, {prefix: "/admin"});
fastify.register(chat_routes, {prefix: "/chat"});
fastify.register(message_routes, {prefix: "/messages"});
fastify.register(websocket_routes);

// Export Fastify instance
module.exports = fastify;

