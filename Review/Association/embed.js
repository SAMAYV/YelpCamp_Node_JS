var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/blog_demo', {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// POST-title,content
var postSchema = new mongoose.Schema({
	title: String,
	content: String
});
var Post = mongoose.model("Post",postSchema);

// USER- name,email
var userSchema = new mongoose.Schema({
	email: String,
	name: String,
	posts: [postSchema]
});
var User = mongoose.model("User",userSchema);


// var newUser = new User({
// 	email: "hermoine@hogwards.edu",
// 	name: "Hermoine Granger"
// });
// newUser.posts.push({
// 	title: "How to use polyjuice potion",
// 	content: "Just go to potions class and learn it"
// });

// newUser.save(function(err,user){
// 	if(err){
// 		console.log(err);
// 	}
// 	else {
// 		console.log(user);
// 	}
// });

// var newPost = new Post({
// 	title: "Reflection on Apples",
// 	content: "They are delicious"
// });
// newPost.save(function(err,post){
// 	if(err){
// 		console.log(err);
// 	}
// 	else {
// 		console.log(post);
// 	}
// });

User.findOne({name:"Hermoine Granger"},function(err,user){
	if(err){
		console.log(err);
	}
	else {
		user.posts.push({
			title:"3 things I really hate",
			content:"Voldemort Voldemort Voldemort"
		});
		user.save(function(err,user){
			if(err){
				console.log(err);
			}
			else {
				console.log(user);
			}
		});
	}
});

// app.listen(process.env.PORT || 3000, process.env.IP, function() { 
// 	console.log('Associations Server listening on port 3000'); 
// });
