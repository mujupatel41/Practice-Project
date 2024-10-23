const express = require("express");
const router = express.Router();
const wrapAcync = require("../utils/wrapAsync.js");
const Listing = require("../models/listingModel.js");
const {isLoggedIn, isOwner, validateLising} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



router.route("/")
.get( wrapAcync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateLising, wrapAcync(listingController.createListing));

// New Route

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAcync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateLising, wrapAcync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAcync(listingController.destroyListing));


// Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAcync(listingController.renderEditForm));


module.exports = router;