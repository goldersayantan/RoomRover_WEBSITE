const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../models/schema.js");  // Used to validate the listing schema and Used to validate the review schema
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const router = express.Router({mergeParams : true});  // We are setting 'mergeParams : true' to smoothly work with adding reviews

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else   {
        next();
    }
}

// Reviews
// Create Route
router.post("/", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review added successfully!")
    res.redirect(`/listings/${listing._id}`)
}));

// Delete Route
router.post("/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findById(reviewId);
    req.flash("success", "Review deleted successfully !")
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
