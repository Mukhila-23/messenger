const uservice = require("../service/user_service");
const umodel = require("../model/user_model");
const frontendUrl = process.env.FRONTEND_URL;

// Register a new user
async function register_con(req, res) {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        //joi
        const {error, value}=umodel.register_val.validate({name: name,email: email,password: password});

        if (error) {
            return res.code(400).send({
                message: error.details[0].message
            });
        }

        // Create the account
        const data = await uservice.register_ser(value.name,value.email,value.password);
        return res.code(201).send({
            message: "User registered successfully",
            user: data
        });

    } 
    catch (error) {
        if (error.message === "user already exists") {
            return res.code(409).send({
                message: error.message
            });
        }
        req.log.error(error);

        return res.code(500).send({
            message: "Internal server error"
        });
    }
}


// Login using email and password
async function login_con(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Validate the login details
        const { error, value } = umodel.login_val.validate({email: email,password: password});

        if (error) {
            return res.code(400).send({
                message: error.details[0].message
            });
        }
        const user = await uservice.login_ser(value.email,value.password);
        const token = await res.jwtSign({userId: user.id.toString(),email: user.email,role: user.role},
        {expiresIn:"30m"});

        return res.code(200).send({
            message: "Login successful",
            token: token,
            user: user
        });

    } 
    catch (error) {
        if (error.message === "invalid email or password") {
            return res.code(401).send({
                message: "Invalid email or password"
            });
        }

        req.log.error(error);

        return res.code(500).send({
            message: "Internal server error"
        });
    }
}


// Login or register using Google
async function google_callback_con(req, res) {
    try {
        // Step 1: Exchange Google's authorization code for a token
        const { token } =await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req,res);

        // Step 2: Ask Google for the user's profile
        const googleResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo",
            {headers: {Authorization: `Bearer ${token.access_token}`}} );

        if (!googleResponse.ok) {
            throw new Error("Could not get Google user details");
        }

        const googleUser = await googleResponse.json();

        // Step 3: Check that Google verified the email
        if (!googleUser.email || googleUser.verified_email !== true ||!googleUser.id) {
            return res.code(401).send({
                message: "Please use a Google account with a verified email"
            });
        }

        // Step 4: Find the user or create a new account
        const user = await uservice.google_login_ser(googleUser.name || googleUser.email,googleUser.email,googleUser.id);

        // Step 5: Create our app's JWT token
        const appToken = await res.jwtSign({userId: user.id.toString(),email: user.email,role: user.role},
            {expiresIn: "30m"});
        // Step 6: Redirect to the React frontend

            if (!frontendUrl) {
                throw new Error("FRONTEND_URL is not configured in .env");
            }

            const redirectUrl = new URL("/oauth/callback", frontendUrl);

            redirectUrl.searchParams.set("token", appToken);
            redirectUrl.searchParams.set("user", JSON.stringify(user));

                    return res.redirect(redirectUrl.toString());}
catch (error) {
    console.error("GOOGLE CALLBACK ERROR:", error);

    return res.code(500).send({
        message: "Google login failed",
        error: error.message
    });
}


}

async function find_user_by_email_con(req, res) {
try {
const query = req.query.query || req.query.email;
const current_user_id = req.user.userId;
    if (!query || !query.trim()) {
        return res.code(400).send({
            message: "Search text is required"});
    }

    // Return a small list so the frontend can show suggestions.
    if (req.query.query) {
        const users = await uservice.search_users_ser(query, current_user_id);
        return res.code(200).send({ users: users });
    }

    const user = await uservice.find_user_by_email_ser(query,current_user_id);

    return res.code(200).send({
        message: "User found",
        user: user
    });

} catch (error) {
    if (error.message === "User not found") {
        return res.code(404).send({
            message: "No user found with that email"
        });
    }

    req.log.error(error);

    return res.code(500).send({
        message: "Internal server error"
    });
}

}


// Make all three functions available to the routes
module.exports = {register_con,login_con,google_callback_con,find_user_by_email_con};
