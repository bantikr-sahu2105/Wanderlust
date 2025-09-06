const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema( {
    title : String,
    description : String,
    image : {
        url: String,
        filename: String,
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
    category: {
    type: String,
    enum: [
      "mountain",
      "arctic",
      "boats",
      "beach",
      "rooms",
      "city",
      "pools",
      "camping",
      "farms",
    ],
  },
});

listingSchema.post("findOneAndDelete" , async(list) => {
    if(list){
        await review.deleteMany({ _id:{$in : list.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;