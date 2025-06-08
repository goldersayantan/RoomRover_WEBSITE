const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to RoomRover!");
        res.redirect("/listings");
    } catch(err)    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/signin", (req, res) => {
    res.render("users/signin.ejs");
})

router.post("/signin", passport.authenticate("local", {failureRedirect : "/signin", failureFlash : true}), async(req, res) => {    // passport.authenticate() is used to authenticate users. it is a middleware in passport
    req.flash("success", "Welcome back to RoomRover!");
    res.redirect("/listings");
})

module.exports = router;


