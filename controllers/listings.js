const Listing = require("../models/listingModel.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.costomRoute = (req, res)=>{
    res.redirect("https://practice-project-fp30.onrender.com/");
};


module.exports.index = async (req, res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {data : allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send()

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, filename)
    let listing = req.body.listing;
    let newListing = await Listing(listing);

    newListing.image = {url, filename};
    newListing.owner = req.user._id;

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();

    console.log(savedListing);
    
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for not exist!");
        res.redirect("/listings");
    };
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_200,w_300");

    res.render("listings/edit.ejs", {listing, originalImage});
};

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
    
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing =  async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};