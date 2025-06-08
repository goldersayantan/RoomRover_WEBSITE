const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");  // Used for delete and update
const ejsMate = require("ejs-mate");  // It helps to create layouts, include layout in webpage like "boilerplate"
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const PORT = 8080;

// Routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/roomrover";

main()
    .then(() => {
        console.log("Connected To DB");
    })
    .catch((err) => {
        console.log(err);
    });


async function main()   {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));  // Parse URL-encoded data from forms
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());  // Parse incoming JSON

const sessionOptions = {
    secret : "mySuperSecretCode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,  // For 1 week in milliSecond
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

app.use(session(sessionOptions));  // Using Sessions
app.use(flash()) // Using flash for success and failure message

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) =>  {
    res.send("Hi ! I am root.");
});

// For showing flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Here we are using all the routes starting with 'listings'
app.use("/listings", listingRoutes);

// Here we are using all the routes starting with 'listings/:id/reviews'
app.use("/listings/:id/reviews", reviewRoutes);

// Here we are using all the routes starting with
app.use("/", userRoutes);


// Fallback route for undefined paths
app.use((req, res, next) => {
    const err = new ExpressError(404, 'This path does not exist.');
    next(err); // Pass it to the error handler
});

app.use((err, req, res, next) => {
    let {status = 500, message = "Something went wrong!"} = err;
    res.status(status).render("errors/error.ejs", {message})
});

app.listen(PORT, () => {
    console.log(`App is running on : http://localhost:${PORT}`);
});

