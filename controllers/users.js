const User = require("../models_Schema/user.js");

module.exports.renderSignup = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signupForm =async(req,res) => {
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
    
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to World__Tour!!");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req,res) => {
        req.flash("success","Welcome back to Wanderlust!!");
        let reDirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(reDirectUrl);
}

module.exports.logout = (req,res,next) =>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}