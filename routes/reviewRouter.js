const express = require("express");
const router = express.Router({ mergeParams : true });
const Review = require("../models/reviewModel.js");
const Listing = require("../models/listingModel.js");
const wrapAcync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Reviews
// Post Route

router.post("/", isLoggedIn, validateReview, wrapAcync(reviewController.createReview));

// Delete Route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAcync(reviewController.destroyReview));

module.exports = router;