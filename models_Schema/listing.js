const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema( {
    title : String,
    description : String,
    image : {
        type : String,
        default : 
            "https://cdn.pixabay.com/photo/2018/02/13/23/41/nature-3151869_960_720.jpg",
        set: (v) => 
            v === ""
                ? "https://img.freepik.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_74190-1075.jpg"
                : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete" , async(list) => {
    if(list){
        await review.deleteMany({ _id:{$in : list.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;