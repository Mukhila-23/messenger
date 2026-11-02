const { MongoClient } = require("mongodb");
const env = require("./env");
const client = new MongoClient(env.mongo_url);

let db;

async function connect_db()
{
await client.connect();
db = client.db(env.db_name);
console.log("db created successfully");
}

function getdb() {
return db;
}

module.exports = {connect_db,getdb};
