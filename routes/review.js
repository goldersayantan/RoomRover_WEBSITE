const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const router = express.Router({mergeParams : true});  // We are setting 'mergeParams : true' to smoothly work with adding reviews
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware/middleware.js")

// Reviews
// Create Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review added successfully!")
    res.redirect(`/listings/${listing._id}`)
}));

// Delete Route
router.post("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findById(reviewId);
    req.flash("success", "Review deleted successfully !")
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
