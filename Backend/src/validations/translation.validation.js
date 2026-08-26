const Joi = require("joi");
 
const translateMessageSchema = Joi.object({
 
    language: Joi.string()
        .trim()
        .min(2)
        .required()
 
});
 
 
module.exports = {
    translateMessageSchema
};
 