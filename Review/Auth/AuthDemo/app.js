var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user");

var app = express();

app.use(require("express-session")({
	secret: "vsam09_iitg",
	resave: false,
	saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost:27017/auth_demo_app', {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// ROUTES

app.get("/",function(req,res){
	res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");	
});

// AUTH ROUTES

app.get("/register",function(req,res){
	res.render("register");
});
app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			res.render("register");
		}
		else {
			passport.authenticate("local")(req,res,function(){
				res.redirect("/secret");						   
			});	
		}
	});
});

// LOGIN ROUTES
app.get("/login",function(req,res){
	res.render("login");
});

//middleware
app.post("/login",passport.authenticate("local",{
	successRedirect: "/secret",
	failureRedirect: "/login"
}),function(req,res){	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}	
	res.redirect("/login");
};

app.listen(process.env.PORT || 3000, process.env.IP, function() { 
	console.log('Server listening on port 3000'); 
});