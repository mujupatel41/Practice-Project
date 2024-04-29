const mongoose = require("mongoose");
const Listing = require("../models/listingModel");
const initData = require("./data");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main(){
    await mongoose.connect(MONGO_URL);
};


main().then(()=>{
    console.log("DB Connection Sucsessful!");
}).catch((err)=>{console.log(err)});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "65c3333466544d06db21ed20"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data Was Initialized");
};

// initDB();
