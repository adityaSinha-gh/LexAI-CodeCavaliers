const mongoose = require("mongoose")
const conversation = require("../models/conversation")
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    role:{
        type:String,
        required:true, 
        enum:['user','LexAI']
    },
    content:{
        type:String,
        reqiuired:true,

    },
    language:{
        type:String,
        required:true,
    }

},{
    timeStamps:true
})

module.exports = mongoose.model("Message",messageSchema)