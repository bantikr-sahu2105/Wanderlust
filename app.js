require('dotenv').config()
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models_Schema/user.js");

//ROUTES
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

const dbUrl = process.env.AtLASDB_URL;

main()
    .then( (res) => {
        console.log("Connection successfull");
    })
    .catch((err) =>{
         console.log(err);
    });


async function main() {
  await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret: process.env.SECRET,
    }
}); 

store.on("error",() =>{
    console.log("MONGO SESSION STORE ERROR!!");
});

const sessionOptions = { 
    store,
    secret: process.env.SECRET,
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

//For_all_listings_routes
app.use("/listings", listingRouter);

//For_all_listings/:id/reviews_routes
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page Not found!!123"));
})

app.use((err,req,res,next) => {
    let { statusCode=500,message="Something went wrong!!"} = err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080, () =>{
    console.log("Server is listening to port 8080!!");
});