async function auth_middleware(req, res) {
    try {
        await req.jwtVerify();
    }
    catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.code(401).send({
            message: "Unauthorized! Login again."
        });
    }
}

module.exports = auth_middleware;

