const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models_Schema/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlware.js");
const listingController = require("../controllers/listing.js");

//INDEX ROUTE
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));
 
//NEW ROUTE__FORM
router.get("/new",isLoggedIn, listingController.renderNewForm);

// SHOW ROUTE
router.route("/:id")
    .get(wrapAsync( listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));
 
module.exports = router;