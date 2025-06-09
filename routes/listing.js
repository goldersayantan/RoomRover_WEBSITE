const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../models/schema.js");  // Used to validate the listing schema and Used to validate the review schema
const {isLoggedIn, isOwner, validateListing} = require("../middleware/middleware.js");

// controllers for listings
const listingController = require("../controllers/listing.js")


// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.newForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEdit));

// Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
