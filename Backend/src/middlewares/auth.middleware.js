const jwt = require("jsonwebtoken")
const User = require("../models/user.js")
const Conversation = require("../models/conversation.js")
const message = require("../models/message.js")
const config = require("../config/config.js")



async function Authenticated(req, res, next) {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}
async function AuthorizationConvo(req, res, next) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const convo = await Conversation.findById(id);

        if (!convo) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        if (userId.toString() !== convo.student_id.toString()) {
            return res.status(403).json({
                success: false,
                message: "User is not authorized"
            });
        }

        req.conversation = convo;

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


module.exports = {
    Authenticated,
    AuthorizationConvo
}