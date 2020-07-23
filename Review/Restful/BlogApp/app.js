var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var BlogPost = new mongoose.Schema({
	title: String,
	image: String,
	created: Date,
	body: String
});
var Blog = mongoose.model("Blog", BlogPost);

// RESTFUL ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else {
			res.render("index",{blogs:blogs});
		}
	});
});

// NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs",function(req,res){
	
	// console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// console.log(req.body);
	
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else {
			res.redirect("/blogs");
		}
	});
});

// SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else {
			res.render("show",{blog:foundBlog});
		}
	});
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else {
			res.render("edit",{blog:foundBlog});
		}
	})
});

// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	// id,newdata,callback
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs");
		}
	})
});

app.listen(process.env.PORT || 3000, process.env.IP, function() { 
	console.log('BlogPost Server listening on port 3000'); 
});