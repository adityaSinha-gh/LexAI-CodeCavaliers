const express = require("express");
const router = express.Router();
const WrapAsync = reqiuire("../utility/WrapAsync.js")
const validate = require("../middlewares/validate.js");

const {
    messageSchema
} = require("../validations/conversation.message.js");

const {
    createMessage,
    getMessages
} = require("../controllers/messageController.js");

const Auth= require("../middlewares/auth.middleware.js");

router.post(
    "/:conversation_id",
    Auth.Authenticated,
    Auth.AuthorizationConvo,
    validate(messageSchema),
   WrapAsync( createMessage)
);



router.get(
    "/:id",
    Auth.Authenticated,
   WrapAsync( getMessages)
);


module.exports = router;