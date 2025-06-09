const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware/middleware.js");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to RoomRover!");
            res.redirect("/listings");
        })
    } catch(err)    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/signin", (req, res) => {
    res.render("users/signin.ejs");
})

router.post("/signin", saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/signin", failureFlash : true}), async(req, res) => {    // passport.authenticate() is used to authenticate users. it is a middleware in passport
    req.flash("success", "Welcome back to RoomRover!");
    let redirectUrl = res.locals.redirectUrl || "/listings"  // if redirectUrl is empty then the other one will work
    res.redirect(redirectUrl);  // check middleware.js
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("success", "You are logged out successfully!");
        res.redirect("/listings");
    })
});

module.exports = router;


