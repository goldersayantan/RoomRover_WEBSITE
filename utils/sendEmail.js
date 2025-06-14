const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

async function sendReservationEmail(hostEmail, listingTitle, data) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: hostEmail,
        subject: `New Reservation Request for "${listingTitle}"`,
        text: `
            A user has requested to reserve your stay: "${listingTitle}".
            
            Details:
            - Name: ${data.fullName}
            - Email: ${data.email}
            - Address: ${data.address}
            - Check-in: ${data.startDate}
            - Check-out: ${data.endDate}
            - Days : ${data.days}
            - Guests: ${data.guests}
            
            This is just a notification. No data was stored in the system.
        `
    };

    try {
        return await transporter.sendMail(mailOptions);
    } catch (err) {
        req.flash("error", "Failed to send reservation email. Please try again later.");
        return null;
    }
}

module.exports = sendReservationEmail;
