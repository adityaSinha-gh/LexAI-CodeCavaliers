const mongoose = require("mongoose")
const Schema = mongoose.Schema

const quizSchema = new Schema({
    user_id:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    
})

