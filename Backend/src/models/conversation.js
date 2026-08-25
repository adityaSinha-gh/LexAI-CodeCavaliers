const mongoose = require("mongoose")
const User = require("./user.js")
const Schema = mongoose.Schema;

const conversation_schema = new Schema({
student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
    title:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        requried:true,
    },
    language:{
        type:String,
        required:true,
    }
},{
    timeStamp:true
})

