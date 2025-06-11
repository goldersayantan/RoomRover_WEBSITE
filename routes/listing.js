const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware/middleware.js");
const multer = require("multer");    // To parse form data we are using multer
const {storage} = require("../cloudconfig/cloudConfig.js");
const upload = multer({storage});    // The uploaded images will be stored in the uploads folder



// controllers for listings
const listingController = require("../controllers/listing.js")

// New Route
router.get("/new", isLoggedIn, listingController.newForm);

// Index Route and Create Route
router.route("/")
    .get(wrapAsync(listingController.index))    // Index Route
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));  // Create Route


// Show Route, Update Route and Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEdit));

module.exports = router;
