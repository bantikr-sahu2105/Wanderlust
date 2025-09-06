const Listing = require("../models_Schema/listing.js");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
 }

 module.exports.renderNewForm = (req,res) => {
    
    res.render("./listings/new.ejs");
 }

 module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
    }

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const onelisting = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{
                path:"author",
            },
        })
        .populate("owner");
    if(!onelisting){
        req.flash("error","Listing you requested for does not exist!!");
        res.redirect("/listings");
    }
    console.log(onelisting);
    res.render("./listings/show.ejs", {onelisting});
    }

module.exports.renderEditForm = async(req,res) =>{
    let {id} = req.params;
    let unqlisting = await Listing.findById(id);
    if(!unqlisting){
        req.flash("error","Listing you requested for does not exist!!");
        res.redirect("/listings");
    }
    let orginalImageUrl = unqlisting.image.url;
    orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs",{unqlisting,orginalImageUrl});
    }

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate( id, {...req.body.listing});

     if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
        req.flash("success","Listing Updated!!");
        res.redirect(`/listings/${id}`);
}
module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let dellisting = await Listing.findByIdAndDelete(id);
    console.log(dellisting);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
    }