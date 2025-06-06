const express = require("express");
const app = express();
const PORT = 3000;
const users = require("./routes/user.js");
const posts = require("./routes/user.js");

app.get("/", (req, res) => {
    res.send("Hi! I am root.");
});

app.use("/users", users);  // common path from user.js
app.use("/posts", posts)

app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`);
});


