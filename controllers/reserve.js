const Listing = require("../models/listing");
const sendReservationEmail = require("../utils/sendEmail");

module.exports.reserveForm = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you want to reserve does not exist")
        res.redirect("/listings");
    }else   {
        res.render("reserve/reserve.ejs", {listing});
    }
}

module.exports.sendEmail = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate('owner');
    if(!listing || !listing.owner || !listing.owner.email)  {
        req.flash("error", "Listing or owner not found.");
    }
    let {fullName, email, address, guests, days, date} = req.body;
    let startDate = new Date(date);
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + parseInt(days));
    let data = {
        fullName,
        email,
        address,
        startDate : startDate.toDateString(),
        endDate : endDate.toDateString(),
        days : days,
        guests
    };
    await sendReservationEmail(listing.email, listing.title, data);
    req.flash('success', 'Reservation request sent to the host. Soon The owner will contact you via email.');
    res.redirect(`/listings/${id}`);
}
