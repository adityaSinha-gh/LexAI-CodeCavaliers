const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
 
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
 
 
 
const authRoutes = require("./routes/auth.routes.js");
const conversationRoutes = require("./routes/conversation.routes.js");
const messageRoutes = require("./routes/message.routes.js");
 
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
 
 
 
 
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});
 
 
 
 
const errorHandler = require("./middlewares/error.middleware.js");
 
app.use(errorHandler);
 
 
module.exports = app;