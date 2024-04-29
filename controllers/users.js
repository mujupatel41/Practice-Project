const User = require("../models/userModel.js");


module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res, next)=>{
    try{
        let { username, email, password } = req.body;
        let newUser = new User({username, email});
        let registerUser = await User.register(newUser, password);
        req.logIn(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Wellcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch(error){
        req.flash("error", error.message);
        res.redirect("/signup");
    };
    
};

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req, res)=>{
    req.flash("success","Wellcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};