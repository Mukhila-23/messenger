const dotenv=require("dotenv")
const path=require("path")

dotenv.config({path:path.resolve(__dirname,"../.env")})

module.exports={
    ports: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    db_name: process.env.DB_NAME,
    jwt_secret:process.env.JWT_SECRET,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET, 
    google_callback_url: process.env.GOOGLE_CALLBACK_URL
}
