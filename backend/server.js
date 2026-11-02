const server = require("./app");
const { connect_db } = require("./config/db");
const { ports } = require("./config/env");

async function server_start() {
try {
await connect_db();
    await server.ready();
    await server.listen({port: Number(ports),host: "127.0.0.1"});
} catch (error) {
    console.log(error);
    process.exit(1);
}
}

server_start();
