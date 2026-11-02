const joi = require("joi");

// Register validation
const register_val = joi.object({

    name: joi.string().trim().required().min(5).max(30).pattern(/^[A-Za-z0-9 ]+$/).messages({
            "string.empty": "enter the name",
            "string.min": "name should have minimum 5 characters",
            "string.max": "name should have maximum 30 characters only",
            "any.required": "enter the name",
            "string.pattern.base":"name should contain only alphabets, digits and space"
        }),

    email: joi.string().trim().lowercase().required().max(254).email().messages({
            "string.empty": "enter the email",
            "any.required": "enter the email",
            "string.email": "enter a valid email",
            "string.max": "email must not exceed 254 characters"
        }),

    password: joi.string().min(6).max(20).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/)
        .messages({
            "string.empty": "enter the password",
            "any.required": "enter the password",
            "string.min": "password must contain at least 6 characters",
            "string.max": "password should have a maximum of 20 characters",
            "string.pattern.base":"password must contain at least one uppercase letter, one lowercase letter and one number"
        })

}).unknown(false);


// Login validation
const login_val = joi.object({

    email: joi.string().trim().lowercase().required().max(254).email().messages({
            "string.empty": "enter the email",
            "any.required": "enter the email",
            "string.email": "enter a valid email",
            "string.max": "email must not exceed 254 characters"
        }),

    password: joi.string().min(6).max(20).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/).messages({
            "string.empty": "enter the password",
            "any.required": "enter the password",
            "string.min": "password must contain at least 6 characters",
            "string.max": "password should have a maximum of 20 characters",
            "string.pattern.base":"password must contain at least one uppercase letter, one lowercase letter and one number"
        })

}).unknown(false);


// Google OAuth validation
const google_auth_val = joi.object({

    credential: joi.string().required().messages({
            "string.empty": "Google credential is required",
            "any.required": "Google credential is required"
        })

}).unknown(false);


module.exports = {register_val,login_val,google_auth_val};