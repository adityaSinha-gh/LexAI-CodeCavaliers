const Message = require("../models/message.js");
const Conversation = require("../models/conversation.js");
const config = require("../config/config.js")

async function createMessage(req, res) {
    try {
        const { conversation_id } = req.params;
        const { content } = req.body;

        const student_id = req.user.id;

        const conversation = await Conversation.findOne({
            _id: conversation_id,
            student_id
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

       
        const studentMessage = new Message({
            conversation_id,
            sender: "student",
            content
        });

        await studentMessage.save();
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
            return res.status(500).json({
                success: false,
                message: "AI service failed"
            });
        }


        
        const data = await response.json();


        const aiContent = data.response;


       
        const aiMessage = new Message({
            conversation_id,
            sender: "ai",
            content: aiContent
        });

        await aiMessage.save();


        
        res.status(201).json({
            success: true,
            studentMessage,
            aiMessage
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to process message",
            error: error.message
        });
    }
}

async function getMessages(req,res){
    const {id} = req.params
    const convo = await Conversation.findById(id)
    if(!convo){
        return res.status(404).json({
            success:false,
            message:"No conversation found"
        })
    }

    const messages = await Message.find({conversation_id:id});
    res.status(200).json({
        success:true,
        messages
    })
}





module.exports = {
    createMessage,
    getMessages
};