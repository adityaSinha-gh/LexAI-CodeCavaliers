const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversation_id:{
        type:String,
        required:true
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