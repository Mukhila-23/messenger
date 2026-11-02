function role_middleware(roles) {
    return async function (req, res) {

        const u_role = req.user.role;

        if (!roles.includes(u_role)) {
            return res.code(403).send({
                message: "Access denied"
            });
        }
    };
}

module.exports = role_middleware;

