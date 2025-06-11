const Listing = require("../models/listing");
const {listingSchema} = require("../models/schema");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {allListings});
};

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate([
            {
                path: "reviews",
                populate: {
                    path: "author"
                }
            },
            {
                path: "owner"
            }
        ]);  // using populate to retrieve reviews, owner
    if(!listing)    {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    listingSchema.validate(req.body);
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
}

module.exports.renderEdit = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }else   {
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
        req.flash("success", "Listing Edited Successfully!");
        res.render("listings/edit.ejs", {listing, originalImageUrl});
    }
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined")    {  // it means file is not given
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}


