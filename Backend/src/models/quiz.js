const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const quizSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        subject: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);
 
module.exports = mongoose.model("Quiz", quizSchema);