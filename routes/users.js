const express = require("express");
const router = express.Router();
const User = require("../models_Schema/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlware.js");

const UserController = require("../controllers/users.js");
//Signup Routes
router.route("/signup")
    .get(UserController.renderSignup)
    .post(wrapAsync( UserController.signupForm)); 

//Login Routes
router.route("/login")
    .get(UserController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), UserController.login);

router.get("/logout", UserController.logout);

module.exports = router;