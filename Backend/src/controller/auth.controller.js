
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

async function signUp(req, res) {
    
        const {
            name,
            email,
            college,
            year,
            branch,
            semester,
            preferredLanguage,
            password
        } = req.body;
        if (
            !name ||
            !email ||
            !college ||
            !year ||
            !branch ||
            !semester ||
            !preferredLanguage ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

      
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            year,
            branch,
            semester,
            preferredLanguage
        });
        
        


        return res.status(201).json({
            message: "User successfully created"
        });




}

module.exports = { signUp };