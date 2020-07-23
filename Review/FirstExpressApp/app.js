var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var friends = ["samay","sv","mb","kv"];
// routers

app.get("/",function(req,res){
	res.render("home");
});

app.post("/addfriend",function(req,res){
	var newFriend = req.body.newfriend;
	friends.push(newFriend);
	res.redirect("/friends");	
});

app.get("/friends",function(req,res){
	res.render("friends",{friends:friends});	
});

app.get("/fell/:thing",function(req,res){
	var thing = req.params.thing;
	res.render("love",{thingVar : thing});
});

app.get("/posts",function(req,res){
	var posts = [
		{title: "Post 1", author: "Susy"},
		{title: "MB", author: "Samay"},
		{title: "Post 2", author: "Sam"},
	];
	res.render("post",{post:posts});
});

app.get("/r/:subreddit",function(req,res){
	var p = req.params.subreddit;
	res.send("WELCOME TO THE " + p.toUpperCase() + " SUBREDDIT");	
});

app.get("/r/:subreddit/comments/:id/:title",function(req,res){
	res.send("COMMENTS PAGE");	
});

app.get("*",function(req,res){
	res.send("Wrong URL!!");
});

// tell express to listen for requests
app.listen(process.env.PORT || 3000, process.env.IP, function() { 
	console.log('Server listening on port 3000'); 
});
