const express = require("express")
const User = require("../models/user.js")
const controllers = require("../controller/auth.controller.js")
const WrapAsync = reqiuire("../utility/WrapAsync.js")
const validate = require("../middlewares/validate.js");

const router= express.Router()
const PORT = 3000;

const {
    signupSchema,
    loginSchema
} = require("../validations/auth.validation.js");


router.post("/Signup",validate(signupSchema),WrapAsync(controllers.signUp));
router.post("/login",validate(loginSchema),WrapAsync(controllers.login));
router.post("/refreshToken",WrapAsync(controllers.refreshToken));

module.exports = router;