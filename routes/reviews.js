const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models_Schema/review.js");
const Listing = require("../models_Schema/listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middlware.js")

const ReviewController = require("../controllers/reviews.js");
//REVIEWS--->POST ROUTE
router.post("/",isLoggedIn,validateReview,wrapAsync( ReviewController.createReview));

//REVIEWS---->DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(ReviewController.deleteReview));

module.exports = router;