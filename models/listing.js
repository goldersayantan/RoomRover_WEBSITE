const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        set : (v) => v === "" ? "https://images.unsplash.com/photo-1566073771259-6a8506099945" : v,
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"    // review.js exported module
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"    // user.js exported module
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

