const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models_Schema/listing.js");
// const path = require("path");

let Mongo_URL = "mongodb://127.0.0.1:27017/worldtour";

main()
    .then((res) => {
        console.log("Connection successfull !!!");
    })
    .catch((err) =>{
         console.log(err);
    });


async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj,owner:"662bb301c8e5339b1f3b59c8"}));
    await Listing.insertMany(initData.data);
    console.log("Data Inserted!!");
};

//initDB(); 