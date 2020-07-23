var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
		{name: "Selmon", image:"https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350"},
		{name: "Abcd", image:"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
		{name: "Samay", image:"https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&h=350"}
	]

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/",function(req,res){
	res.render("landing");	
});

app.get("/campgrounds",function(req,res){	
	res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var campground = {name:name,image:image};
	campgrounds.push(campground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
	res.render("new");
});

app.listen(process.env.PORT || 3000, process.env.IP, function() { 
	console.log('YelpCamp Server listening on port 3000'); 
});