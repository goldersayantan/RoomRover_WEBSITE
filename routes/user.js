const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware/middleware.js");

// Controller for user
const userController = require("../controllers/user.js");

// Sign Up form and Sign Up route
router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup));

// Sign In form and Sign In route
router.route("/signin")
    .get(userController.signinForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/signin", failureFlash : true}), userController.signin)

// Logout
router.get("/logout", userController.logOut);

module.exports = router;


