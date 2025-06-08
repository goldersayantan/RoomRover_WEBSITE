const express = require("express");
const app = express();
const PORT = 3000;
const users = require("./routes/user.js");
const posts = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: 'superSecretWord',
    resave : false,
    saveUninitialized : true
};

app.use(session(sessionOptions));

app.use(flash());

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("Success", "User registered successfully")
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    res.locals.messages = req.flash("Success");
    res.render("page.ejs", {name : req.session.name});
})

// app.get("/requestCount", (req, res) => {
//     if(req.session.count)   {
//         req.session.count++;
//     }else   {
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

app.use("/users", users);  // common path from user.js
app.use("/posts", posts)

app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`);
});


