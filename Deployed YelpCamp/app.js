var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require('mongoose'),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds"),
	flash = require("connect-flash"),
	passport = require("passport"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user");

var CommentRoutes = require("./routes/comments"),
	CampgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index"),
	reviewRoutes = require("./routes/reviews");

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// DATABASE

// Development Database Url: mongodb://localhost:27017/yelp_camp
// Server Database Url: mongodb+srv://yelpcamp:mud31347@yelpcamp.by3zp.mongodb.net/yelpcamp?retryWrites=true&w=majority

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "vsam09_iitg",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();	
});

app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use(authRoutes);
app.use(CommentRoutes);
app.use(CampgroundRoutes);

//SERVER
app.listen(process.env.PORT || 3000, process.env.IP, function() { 
	console.log('YelpCamp Server listening on port 3000'); 
});