const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const wrapAcync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

// SignUp Route

router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAcync(userController.signup))

// LogIn Route

router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login)

// Logout Route

router.get("/logout", userController.logout);

module.exports = router;