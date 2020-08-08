var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

router.get("/",function(req,res){
	res.render("landing");	
});

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    var noMatch = null;
    if(req.query.search){
    	const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    	// filering on basis of title of each campground
    	Campground.find({name: regex}, function(err, allCampgrounds){
	        if(err){
	           console.log(err);
	        } 
	        else {
	       		if(allCampgrounds.length < 1) {
                	noMatch = "No campgrounds match that query, please try again.";
              	}
	          	res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds', noMatch: noMatch});
	        }
	    });
    }
    else {
    	Campground.find({}, function(err, allCampgrounds){
	       if(err){
	           console.log(err);
	       } else {
	          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds', noMatch: noMatch});
	       }
	    });
    }
});

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var price = req.body.price;
	var newcampground = {name:name,image:image,description:description,author: author,price:price};
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

// Campground Like Route
router.post("/campgrounds/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

// Show about one campground
router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments likes").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else {
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
});

// Edit Campground 
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit", {campground:foundCampground});
	});		
});

// Update Campground
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Destroy Campground
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
