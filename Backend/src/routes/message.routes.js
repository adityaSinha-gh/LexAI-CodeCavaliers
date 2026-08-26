const express = require("express");
const router = express.Router();
const WrapAsync = reqiuire("../utility/WrapAsync.js")

const {
    createMessage,
    getMessages
} = require("../controllers/messageController.js");

const Auth= require("../middlewares/auth.middleware.js");

router.post(
    "/:conversation_id",
    Auth.Authenticated,
    Auth.AuthorizationConvo,
   WrapAsync( createMessage)
);



router.get(
    "/:id",
    Auth.Authenticated,
   WrapAsync( getMessages)
);


module.exports = router;