const Joi = require("joi");

const conversationSchema = Joi.object({
    title: Joi.string().required(),
    subject: Joi.string().required(),
    language: Joi.string().required()
});

module.exports = {
    conversationSchema
};