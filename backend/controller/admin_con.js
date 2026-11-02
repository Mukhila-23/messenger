const admin_service = require("../service/admin_service");

// View all users
async function get_all_users_con(req, res) {
try {
const users = await admin_service.get_all_users();
return res.code(200).send({
        message: "users retrieved successfully",
        users: users
    });

} catch (error) {
    req.log.error(error);
    return res.code(500).send({message: "internal server error"});
}
}

// Find user by email
async function find_user_con(req, res) {
try {
const email = req.params.email;
const user = await admin_service.find_user(email);
if (!user)
{
     return res.code(404).send({message: "user not found"});
    }

    return res.code(200).send({
        message: "user found successfully",
        user: user
    });

} catch (error) {
    req.log.error(error);
    return res.code(500).send({ message: "internal server error"});
}
}

// Change user role
async function update_role_con(req, res) {
try {
const email = req.body.email;
const role = req.body.role;
const result = await admin_service.update_role(email, role);
return res.code(200).send(result);
} 
catch (error) {
    if (error.message === "user not found") {
        return res.code(404).send({message: error.message});
    }
    if (error.message === "role must be user or admin") {
        return res.code(400).send({message: error.message});
    }
    req.log.error(error);
    return res.code(500).send({
        message: "internal server error"
    });
}
}

// Delete user
async function delete_user_con(req, res) {
try {
const email = req.params.email;
const result = await admin_service.delete_user(email);
return res.code(200).send(result);

} catch (error) {
    if (error.message === "user not found") {
        return res.code(404).send({
            message: error.message
        });
    }
    req.log.error(error);
    return res.code(500).send({
        message: "internal server error"
    });
}
}

module.exports = {get_all_users_con,find_user_con,update_role_con,delete_user_con};
