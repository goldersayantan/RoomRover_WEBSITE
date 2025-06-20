const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONO_URL = "mongodb://127.0.0.1:27017/roomrover";
async function main()   {
    await mongoose.connect(MONO_URL);
}
main().then(() => {
    console.log("Database Connected.");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner : "68459a14df9fadf943b8eab2"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

initDB();

