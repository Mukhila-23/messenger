const { getdb } = require("../config/db");
const { ObjectId } = require("mongodb");

function all_chat() {
    return getdb().collection("chats");
}

async function create_chat_ser(user1_id, user2_id) {
    if (!ObjectId.isValid(user1_id) ||!ObjectId.isValid(user2_id)) {
        throw new Error("Invalid user ID");
    }
    user1_id = new ObjectId(user1_id);
    user2_id = new ObjectId(user2_id);

    if (user1_id.equals(user2_id)) {
        throw new Error("You cannot create a chat with yourself");
    }

    const users = getdb().collection("users");

    const user1 = await users.findOne({ _id: user1_id });
    const user2 = await users.findOne({ _id: user2_id });

    if (!user1 || !user2) {
        throw new Error("One or both users do not exist");
    }

    const old_chat = await all_chat().findOne({participants:{$all: [user1_id, user2_id],$size: 2}});

    if (old_chat) {
        // A user can start a deleted chat again from the search suggestions.
        await all_chat().updateOne(
            { _id: old_chat._id },
            { $pull: { hidden_for: user1_id } }
        );
        return old_chat
    }

    const chat = {
        participants: [user1_id, user2_id],
        created_at: new Date()
    };

    const result = await all_chat().insertOne(chat);
    return {
        _id: result.insertedId,
        participants: chat.participants,
        created_at: chat.created_at
    };
}

async function my_chats_ser(user_id) {
if (!ObjectId.isValid(user_id)) {
    throw new Error("Invalid user ID");
}

user_id = new ObjectId(user_id);
const chats = await all_chat().find({
    participants: user_id,
    hidden_for: { $ne: user_id }
}).sort({ created_at: -1 }).toArray();
const users = getdb().collection("users");
const chats_with_users = await Promise.all(chats.map(async (chat) => {
        const other_user_id = chat.participants.find((participant) => !participant.equals(user_id));
        const other_user = await users.findOne({ _id: other_user_id },{projection: {name: 1,email: 1}});
        return {
            ...chat,
            other_user: other_user
        };
    })
);

return chats_with_users;

}


async function delete_chat_ser(chat_id, user_id) {

    if (!ObjectId.isValid(chat_id) ||!ObjectId.isValid(user_id)) {
        throw new Error("Invalid chat ID or user ID");
    }
    chat_id = new ObjectId(chat_id);
    user_id = new ObjectId(user_id);
    const result = await all_chat().updateOne({_id: chat_id,participants: user_id},{$addToSet:{hidden_for: user_id}});
    if (result.matchedCount === 0) {
        throw new Error("Chat not found or you are not a participant");
    }
    return {
        message: "Chat deleted from your chat list"
    };
}


module.exports = {
    create_chat_ser,
    my_chats_ser,
    delete_chat_ser
};
