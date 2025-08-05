const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
//const rawdata = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");//TO EDIT OR DELETE DATA FROM DB WITH HELP OF POST REQUEST
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const {listingSchema , reviewSchma} = require("./schema.js");
//const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models_Schema/user.js");


//ROUTES
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

let Mongo_URL = "mongodb://127.0.0.1:27017/worldtour";

main()
    .then( (res) => {
        console.log("Connection successfull");
    })
    .catch((err) =>{
         console.log(err);
    });


async function main() {
  await mongoose.connect(Mongo_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));//TO RUN THE POST REQUESTS
app.use(methodOverride("_method"));//TO UPDATE AND DELETE VIA POST REQUEST
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = { 
    secret :"mysecretbaba",
    resave: false,
    saveUninitialized: true, 
    cookie : {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res) =>{
//     let fakeUser = new User({
//         email:"alphabeta852@gmail.com",
//         username:"Thor"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });


// ROOT
app.get("/", (req,res) => {
    res.send("This is root!!");
});


//For_all_listings_routes
app.use("/listings", listingRouter);

//For_all_listings/:id/reviews_routes
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);


//NEW ROUTE
// app.get("/testlisting",async (req,res) =>{
//     let sample = new Listing({
//         title:"Villa leopolda",
//         description:"Best site to enjoy in vacations",
//         price:2000,
//         location : "Riviera",
//         country:"French"
//     });
    
//     await sample.save();
//     console.log("Sample is saved in DB!");
//     res.send("Testing Successful"); 
// });

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page Not found!!123"));
})

app.use((err,req,res,next) => {
    // res.send("Something Went wrong!!");
    let { statusCode=500,message="Something went wrong!!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
})

app.listen(8080, () =>{
    console.log("Server is listening to port 8080!!");
});