const Quiz = require("../models/quiz.js");
const config = require("../config/config.js");
const AppError = require("../utility/AppError.js");




async function createQuiz(req, res) {

    const {
        subject,
        topic,
        language,
        numberOfQuestions
    } = req.body;

    const user_id = req.user.id;


    const response = await fetch(
        `${config.FASTAPI_URI}/quiz`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                subject,
                topic,
                language,
                numberOfQuestions
            })
        }
    );

    if (!response.ok) {
        throw new AppError("AI service failed", 502);
    }

    const data = await response.json();


    const quiz = await Quiz.create({
        user_id,
        subject,
        topic,
        language,
        numberOfQuestions,
        questions: data.questions
    });


    res.status(201).json({
        success: true,
        message: "Quiz created successfully",
        quiz
    });
}




async function getQuizzes(req, res) {

    const user_id = req.user.id;

    const All = await Quiz.find({
        user_id
    });

    if (All.length === 0) {
        throw new AppError("No quizzes found", 404);
    }

    res.status(200).json({
        success: true,
        quizzes: All
    });
}




async function getQuiz(req, res) {

    const { id } = req.params;
    const user_id = req.user.id;

    const oneQuiz = await Quiz.findOne({
        _id: id,
        user_id
    });

    if (!oneQuiz) {
        throw new AppError("Quiz not found", 404);
    }

    res.status(200).json({
        success: true,
        quiz: oneQuiz
    });
}




async function DeleteQuiz(req, res) {

    const { id } = req.params;
    const user_id = req.user.id;

    const oneQuiz = await Quiz.findOneAndDelete({
        _id: id,
        user_id
    });

    if (!oneQuiz) {
        throw new AppError("Quiz not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Quiz successfully deleted"
    });
}


module.exports = {
    createQuiz,
    getQuizzes,
    getQuiz,
    DeleteQuiz
};