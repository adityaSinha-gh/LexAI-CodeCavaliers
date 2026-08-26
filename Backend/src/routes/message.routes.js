const express = require("express");

const router = express.Router();

const WrapAsync = require("../utility/WrapAsync.js");

const validate = require("../middlewares/validate.js");

const {
    messageSchema,
    translateMessageSchema
} = require("../validations/conversation.message.js");

const {
    createMessage,
    getMessages,
    translateMessage
} = require("../controllers/messageController.js");

const Auth = require("../middlewares/auth.middleware.js");


router.post(
    "/:conversation_id",
    Auth.Authenticated,
    Auth.AuthorizationConvo,
    validate(messageSchema),
    WrapAsync(createMessage)
);


router.get(
    "/:id",
    Auth.Authenticated,
    WrapAsync(getMessages)
);


router.post(
    "/:message_id/translate",
    Auth.Authenticated,
    validate(translateMessageSchema),
    WrapAsync(translateMessage)
);


module.exports = router;