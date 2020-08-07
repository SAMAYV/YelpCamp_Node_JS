var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	// eval(require('locus'));
	if(req.body.adminCode === 'secretcode123'){
		newUser.isAdmin = true;
	}
	User.register(newUser,req.body.password,function(err,user){
		if(err){
		    console.log(err);
		    return res.render("register", {error: err.message});
		}
		else {
			// after signing logged in the user
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to YelpCamp" + user.username);
				res.redirect("/campgrounds");						   
			});	
		}
	});
});

//middleware
router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){	
	
});

// LOGOUT
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}	
	res.redirect("/login");
};

module.exports = router;
