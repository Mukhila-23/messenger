const chat_service = require("../service/chat_service");

async function create_chat_con(req, res) {

    try {
        const user1_id = req.user.userId;
        const user2_id = req.body.user_id;

        if (!user2_id) {
            return res.code(400).send({
                message: "User ID is required"
            });
        }

        const chat = await chat_service.create_chat_ser(user1_id,user2_id);

        return res.code(200).send({
            message: "Chat opened successfully",
            chat: chat
        });

    } catch (error) {

        return res.code(400).send({
            message: error.message
        });
    }
}


// Get all chats of the logged-in user
async function my_chats_con(req, res) {

    try {

        const user_id = req.user.userId;
        const chats = await chat_service.my_chats_ser(user_id);

        return res.code(200).send({
            message: "Chats retrieved successfully",
            chats: chats
        });

    } catch (error) {

        return res.code(400).send({
            message: error.message
        });
    }
}



async function delete_chat_con(req, res) {

    try {

        const user_id = req.user.userId;
        const chat_id = req.params.chat_id;

        const result = await chat_service.delete_chat_ser(
            chat_id,
            user_id
        );

        return res.code(200).send(result);

    } catch (error) {

        return res.code(400).send({
            message: error.message
        });
    }
}


module.exports = {create_chat_con,my_chats_con,delete_chat_con};