const Message = require("../models/message.js");
const Conversation = require("../models/conversation.js");
const config = require("../config/config.js");
const AppError = require("../utils/AppError.js");




async function createMessage(req, res) {

    const { conversation_id } = req.params;
    const { content } = req.body;

    const user_id = req.user.id;


   
    const conversation = await Conversation.findOne({
        _id: conversation_id,
        user_id
    });


    if (!conversation) {
        throw new AppError("Conversation not found", 404);
    }


    
    const studentMessage = await Message.create({
        conversation_id,
        sender: "student",
        content
    });


   
    const response = await fetch(
        `${config.FAST_API}/generate`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                conversation_id,
                message: content,
                language: conversation.language
            })
        }
    );


  
    if (!response.ok) {
        throw new AppError("AI service failed", 502);
    }


    const data = await response.json();

    const aiContent = data.response;


    const aiMessage = await Message.create({
        conversation_id,
        sender: "ai",
        content: aiContent
    });


    res.status(201).json({
        success: true,
        studentMessage,
        aiMessage
    });
}




async function getMessages(req, res) {

    const { id } = req.params;

    const user_id = req.user.id;


    
    const convo = await Conversation.findOne({
        _id: id,
        user_id
    });


    if (!convo) {
        throw new AppError("Conversation not found", 404);
    }


    
    const messages = await Message.find({
        conversation_id: id
    }).sort({ createdAt: 1 });


    res.status(200).json({
        success: true,
        messages
    });
}


module.exports = {
    createMessage,
    getMessages
};