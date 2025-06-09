const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware/middleware.js");

// Controller for user
const userController = require("../controllers/user.js");

// Signup Form
router.get("/signup", userController.signupForm);

// Signup route
router.post("/signup", wrapAsync(userController.signup));

// Sign in Form
router.get("/signin", userController.signinForm);

// Sign in route
router.post("/signin", saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/signin", failureFlash : true}), userController.signin)

// Logout
router.get("/logout", userController.logOut);

module.exports = router;


