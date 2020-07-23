var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

seedDB();

app.get("/",function(req,res){
	res.render("landing");	
});

app.get("/campgrounds",function(req,res){	
	// get all campgrounds from db
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else {
			res.render("campgrounds/index",{campgrounds:allcampgrounds});	
		}
	});
});

app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newcampground = {name:name,image:image,description:description};
	
	// create a new campground and save it to database
	Campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}
		else {
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else {
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
});

// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new",function(req,res){
	Campground.findById(req.params.id,function(err,found){
		if(err){
			console.log(err);
		}
		else {
			res.render("comments/new",{campground:found});	
		}
	});
});

app.post("/campgrounds/:id/comments",function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}
				else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

app.listen(process.env.PORT || 3000, process.env.IP, function() { 
	console.log('YelpCamp Server listening on port 3000'); 
});