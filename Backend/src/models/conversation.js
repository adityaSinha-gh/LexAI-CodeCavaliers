const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const conversation_schema = new Schema({
    student_id:{
        type:String,
        required:true
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

