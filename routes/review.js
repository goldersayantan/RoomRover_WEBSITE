const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const router = express.Router({mergeParams : true});  // We are setting 'mergeParams : true' to smoothly work with adding reviews
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware/middleware.js");

// Controller for reviews
const reviewController = require("../controllers/review.js");

// Reviews
// Create Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Route
router.post("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
