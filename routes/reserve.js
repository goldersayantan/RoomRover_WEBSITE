const express = require("express");
const {isLoggedIn, notOwner} = require("../middleware/middleware");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const reserveController = require("../controllers/reserve.js")

router.route("/")
    .get(isLoggedIn, notOwner, wrapAsync(reserveController.reserveForm))
    .post( isLoggedIn, notOwner, wrapAsync(reserveController.sendEmail));

module.exports = router


