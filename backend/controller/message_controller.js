const message_service = require("../service/message_service");

async function send_message_con(req, res) {
try {
        const sender_id = req.user.userId;
        const chat_id = req.body.chat_id;
        const message = req.body.message;
        if (!chat_id || !message) {
            return res.code(400).send({
                message: "Chat ID and message are required"
            });
        }
        const new_message = await message_service.send_message_ser(chat_id,sender_id,message);
        return res.code(201).send({
            message: "Message sent successfully",
            data: new_message
        });

    } catch (error) {
        return res.code(400).send({
            message: error.message
        });

    }
}

async function get_messages_con(req, res) {

    try {
        const user_id = req.user.userId;
        const chat_id = req.params.chat_id;
        const messages = await message_service.get_messages_ser(chat_id,user_id);
        return res.code(200).send({
            message: "Messages retrieved successfully",
            messages: messages
        });

    } catch (error) {
        return res.code(400).send({
            message: error.message
        });

    }
}


module.exports = {send_message_con,get_messages_con};