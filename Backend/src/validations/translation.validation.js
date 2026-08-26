const Joi = require("joi");


const messageSchema = Joi.object({

    content: Joi.string()
        .trim()
        .min(1)
        .required()

});


const translateMessageSchema = Joi.object({

    language: Joi.string()
        .trim()
        .min(2)
        .required()

});


module.exports = {
    messageSchema,
    translateMessageSchema
};