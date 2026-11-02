const bcrypt = require("bcrypt");
const { getdb } = require("../config/db");
const { ObjectId } = require("mongodb");

function all_user() {
return getdb().collection("users");
}

async function find_user(email) {
return await all_user().findOne({email: email.trim().toLowerCase()});
}

async function create_user(user) {
return await all_user().insertOne(user);
}

// Register service
async function register_ser(name, email, password) {
email = email.trim().toLowerCase();
const old_user = await find_user(email);

if (old_user) {
    throw new Error("user already exists");
}

const h_password = await bcrypt.hash(password, 10);

const user = {
    name: name,
    email: email,
    password: h_password,
    role: "user",
    created_at: new Date()
};

const result = await create_user(user);

return {
    id: result.insertedId,
    name: user.name,
    email: user.email,
    role: user.role
};

}

// Login service
async function login_ser(email, password) {
email = email.trim().toLowerCase();
const user = await find_user(email);

if (!user || !user.password) {
    throw new Error("invalid email or password");
}

const pass_status = await bcrypt.compare(
    password,
    user.password
);

if (!pass_status) 
    {
    throw new Error("invalid email or password");
}

return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
};

}

// Google OAuth login service
async function google_login_ser(name, email, google_id) {
email = email.trim().toLowerCase();
let user = await find_user(email);

if (user) {
    if (!user.google_id) {
        await all_user().updateOne(
            { _id: user._id },
            { $set: { google_id: google_id } }
        );
    }
} else {
    const new_user = {
        name: name,
        email: email,
        google_id: google_id,
        role: "user",
        created_at: new Date()
    };

    const result = await create_user(new_user);

    user = {
        _id: result.insertedId,
        name: new_user.name,
        email: new_user.email,
        role: new_user.role
    };
}

return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
};

}

// Search for another registered user by email
async function find_user_by_email_ser(email, current_user_id) {
email = email.trim().toLowerCase();
if (!ObjectId.isValid(current_user_id)) {
    throw new Error("Invalid current user ID");
}

const current_user = new ObjectId(current_user_id);

const user = await all_user().findOne({email: email,_id: { $ne: current_user}},
    {projection:{name: 1,email: 1}});

if (!user) {
    throw new Error("User not found");
}
return user;
}

// Find a few users while someone is typing in the search box.
async function search_users_ser(query, current_user_id) {
    if (!ObjectId.isValid(current_user_id)) {
        throw new Error("Invalid current user ID");
    }

    const text = query.trim();

    if (!text) {
        return [];
    }

    const current_user = new ObjectId(current_user_id);
    const search = { $regex: text, $options: "i" };

    return all_user().find(
        {
            _id: { $ne: current_user },
            $or: [{ name: search }, { email: search }]
        },
        { projection: { name: 1, email: 1 } }
    ).limit(5).toArray();
}

module.exports = {register_ser,login_ser,google_login_ser,find_user_by_email_ser,search_users_ser};
