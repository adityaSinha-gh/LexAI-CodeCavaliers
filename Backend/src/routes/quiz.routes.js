const express = require("express");
const router = express.Router();

const WrapAsync = require("../utility/WrapAsync.js");
const validate = require("../middlewares/validate.js");

const {
    quizSchema
} = require("../validations/quiz.validation.js");

const {
    createQuiz,
    getQuizzes,
    getQuiz,
    DeleteQuiz
} = require("../controller/quiz.controller.js");

const Auth = require("../middlewares/auth.middleware.js");


router.post(
    "/",
    Auth.Authenticated,
    validate(quizSchema),
    WrapAsync(createQuiz)
);


router.get(
    "/",
    Auth.Authenticated,
    WrapAsync(getQuizzes)
);


router.get(
    "/:id",
    Auth.Authenticated,
    WrapAsync(getQuiz)
);


router.delete(
    "/:id",
    Auth.Authenticated,
    WrapAsync(DeleteQuiz)
);


module.exports = router;