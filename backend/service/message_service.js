const { getdb } = require("../config/db");
const { ObjectId } = require("mongodb");

function all_message() {
    return getdb().collection("messages");
}

async function send_message_ser(chat_id, sender_id, message) {

    if (!ObjectId.isValid(chat_id) ||!ObjectId.isValid(sender_id)) {
        throw new Error("Invalid chat ID or user ID");
    }
    chat_id = new ObjectId(chat_id);
    sender_id = new ObjectId(sender_id);
    message = message.trim();
    if (!message) {
        throw new Error("Message cannot be empty");
    }
    const chat = await getdb().collection("chats").findOne({ _id: chat_id,participants: sender_id});
    if (!chat) {
        throw new Error("Chat not found or you are not a participant");
    }

    const new_message = {
        chat_id: chat_id,
        sender_id: sender_id,
        message: message,
        created_at: new Date()
    };
    const result = await all_message().insertOne(new_message);
    return {
        _id: result.insertedId,
        chat_id: new_message.chat_id,
        sender_id: new_message.sender_id,
        message: new_message.message,
        created_at: new_message.created_at
    };
}

async function get_messages_ser(chat_id, user_id) {

    if (!ObjectId.isValid(chat_id) ||!ObjectId.isValid(user_id)) {
        throw new Error("Invalid chat ID or user ID");
    }
    chat_id = new ObjectId(chat_id);
    user_id = new ObjectId(user_id);
    const chat = await getdb().collection("chats").findOne({_id: chat_id,participants: user_id});

    if (!chat) {
        throw new Error("Chat not found or you are not a participant");
    }
    const messages = await all_message().find({ chat_id: chat_id }).sort({ created_at: 1 }).toArray();

    return messages;
}


module.exports = {send_message_ser,get_messages_ser};