const express = require("express");
const router = express.Router;

// Posts
// Index-Posts
router.get("/", (req, res) => {
    res.send("Get for post");
});

// Show-Posts
router.get("/:id", (req, res) => {
    res.send("Get for post id");
});

// Post Posts
router.post("/", (req, res) => {
    res.send("Post for post");
});

// Delete Posts
router.delete("/:id", (req, res) => {
    res.send("Delete for post");
});

module.exports = router;