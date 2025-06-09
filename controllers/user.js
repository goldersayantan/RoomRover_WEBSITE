const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res) => {
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
}

module.exports.signinForm = (req, res) => {
    res.render("users/signin.ejs");
}

module.exports.signin = async(req, res) => {    // passport.authenticate() is used to authenticate users. it is a middleware in passport
    req.flash("success", "Welcome back to RoomRover!");
    let redirectUrl = res.locals.redirectUrl || "/listings"  // if redirectUrl is empty then the other one will work
    res.redirect(redirectUrl);  // check middleware.js
}

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("success", "You are logged out successfully!");
        res.redirect("/listings");
    })
}

