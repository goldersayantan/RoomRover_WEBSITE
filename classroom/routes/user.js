const express = require("express");
const router = express.Router();

// Users
// Index-Users
router.get("/", (req, res) => {
    res.send("Get for user");
});

// Show-Users
router.get("/:id", (req, res) => {
    res.send("Get for user id");
});

// Post Users
router.post("/", (req, res) => {
    res.send("Post for user");
});

// Delete Users
router.delete("/:id", (req, res) => {
    res.send("Delete for user");
});

module.exports = router;
