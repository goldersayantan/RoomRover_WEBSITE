const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    // Here we don't have to define username and password field. mongoose will do it by default
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

