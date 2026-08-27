const Joi = require("joi");


const quizSchema = Joi.object({

    subject: Joi.string().required(),

    topic: Joi.string().required(),

    language: Joi.string().required(),

    numberOfQuestions: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .required()

});


module.exports = {
    quizSchema
};