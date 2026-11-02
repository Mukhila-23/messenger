const { getdb } = require("../config/db");

function all_user() {
    return getdb().collection("users");
}

// View all users
async function get_all_users() {
    return await all_user().find({}).project({ password: 0 }).toArray();
}

// Find a user by email
async function find_user(email) {
    return await all_user().findOne({ email: email.toLowerCase()},{ projection: { password: 0 } });
}

// Change a user's role
async function update_role(email, role) {
    if (!["user", "admin"].includes(role)) {
        throw new Error("role must be user or admin");
    }

    const result = await all_user().updateOne({ email: email.toLowerCase()},{$set:{role: role}});
    if (result.matchedCount === 0) {
        throw new Error("user not found");
    }
    return { message: "user role updated successfully" };
}   

// Delete a user
async function delete_user(email) {
    const result = await all_user().deleteOne({email: email.toLowerCase()});

    if (result.deletedCount === 0) {
        throw new Error("user not found");
    }

    return { message: "user deleted successfully" };
}

module.exports = {get_all_users,find_user,update_role,delete_user};