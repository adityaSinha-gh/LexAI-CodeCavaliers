const express = require("express");
const router = express.Router();
const WrapAsync = reqiuire("../utility/WrapAsync.js")
const validate = require("../middlewares/validate.js");

const {
    conversationSchema
} = require("../validations/conversation.validation.js");

const {
    createConversations,
    getConversations,
    getConversation,
    DeleteConversation,
    UpdateConversation
} = require("../controllers/conversationController.js");

const Auth = require("../middlewares/auth.middleware.js");



router.post("/", Auth.Authenticated,Auth.AuthorizationConvo,validate(conversationSchema) ,WrapAsync( createConversations));

router.get("/", Auth.Authenticated,WrapAsync(getConversations));

router.get("/:id", Auth.Authenticated, WrapAsync(getConversation));

router.patch("/:id", Auth.Authenticated,Auth.AuthorizationConvo, WrapAsync(UpdateConversation));

router.delete("/:id", Auth.Authenticated, Auth.AuthorizationConvo, WrapAsync(DeleteConversation));

module.exports = router;