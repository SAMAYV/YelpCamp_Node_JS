var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/blog_demo_2', {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var Post = require("./models/post");
var User = require("./models/user");

// Post.create({
// 	title: "How to cook the burger part 3",
// 	content: "abcdefghijkl"
// },function(err,post){
// 	User.findOne({email:"bob@gmail.com"},function(err,foundUser){
// 		if(err){
// 			console.log(err);
// 		}
// 		else {
// 			foundUser.posts.push(post);
// 			foundUser.save(function(err,saveduser){
// 				if(err){
// 					console.log(err);
// 				}
// 				else {
// 					console.log(saveduser);
// 				}
// 			});
// 		}
// 	});
// });

// Find user
// Find all posts for that user

// User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err,user){
// 	if(err){
// 		console.log(err);
// 	}
// 	else {
// 		console.log(user);
// 	}
// });

// User.create({
// 	email: "bob@gmail.com",
// 	name: "Bob Belcher"
// });
