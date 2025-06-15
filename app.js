if(process.env.NODE_ENV != "production")    {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");  // Used for delete and update
const ejsMate = require("ejs-mate");  // It helps to create layouts, include layout in webpage like "boilerplate"
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const PORT = 8080;
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost'; // fallback for local


// Routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const reserveRoutes = require("./routes/reserve.js")

const dbUrl = process.env.ATLASDB_URL;


main()
    .then(() => {
        console.log("Connected To DB");
    })
    .catch((err) => {
        console.log(err);
    });


async function main()   {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));  // Parse URL-encoded data from forms
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/assets")));
app.use(express.json());  // Parse incoming JSON

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 60 * 60, // for 24 hours in second
})

store.on("error", () => {
    console.log("Error in MONGO STORE SESSION.")
});

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
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

// For showing flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;   // Defining current user details in "curruser"
    next();
});

// Here we are using all the routes starting with 'listings'
app.use("/listings", listingRoutes);

// Here we are using all the routes starting with 'listings/:id/reviews'
app.use("/listings/:id/reviews", reviewRoutes);

// Here we are using all the routes starting with
app.use("/", userRoutes);

// Here we are using all the routes starting with 'listings/:id/reserve'
app.use("/listings/:id/reserve", reserveRoutes);


// Fallback route for undefined paths
app.use((req, res, next) => {
    const err = new ExpressError(404, 'This path does not exist.');
    next(err); // Pass it to the error handler
});

app.use((err, req, res, next) => {
    let {status = 500, message = "Something went wrong!"} = err;
    res.status(status).render("errors/error.ejs", {message})
});

// app.listen(PORT, () => {
//     console.log(`App is running on : http://localhost:${PORT}/listings`);
// });
app.listen(PORT, HOST, () => {
    console.log(`App is running on: http://${HOST}:${PORT}/listings`);
});