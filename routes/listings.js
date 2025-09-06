const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models_Schema/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage: storage });

//INDEX ROUTE
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
  upload.single('listing[image]'),
  isLoggedIn,
  (req, res, next) => {
      if (req.file) {
          // Cloudinary stores file info in req.file.path
          req.body.listing.image = req.file.path;  
      }
      next();
  },
  validateListing,
  wrapAsync(listingController.createListing)
);

//NEW ROUTE__FORM
router.get("/new",isLoggedIn, listingController.renderNewForm);

// SHOW ROUTE
router.route("/:id")
    .get(wrapAsync( listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), (req, res, next) => {
      if (req.file) {
          // Cloudinary stores file info in req.file.path
          req.body.listing.image = req.file.path;  
      }
      next();
  },validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));
 
module.exports = router;