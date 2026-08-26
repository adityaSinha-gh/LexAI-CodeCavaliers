const express = require("express")
const User = require("../models/user.js")
const controllers = require("../controller/auth.controller.js")
const WrapAsync = reqiuire("../utility/WrapAsync.js")

const router= express.Router()
const PORT = 3000;


router.post("/Signup",WrapAsync(controllers.signUp));
router.post("/login",WrapAsync(controllers.login));
router.post("/refreshToken",WrapAsync(controllers.refreshToken));

module.exports = router;