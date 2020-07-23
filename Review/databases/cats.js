const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db_name', {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var catSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

var Cat = mongoose.model("Cat",catSchema);

// var mb = new Cat({
// 	name: "MB",
// 	age: 12,
// 	temperament: "abc"
// });

// mb.save(function(err,cat){
// 	if(err){
// 		console.log("something went wrong");
// 	}
// 	else {
// 		console.log(cat);
// 	}
// });

Cat.create({
	name: "snow white",
	age: 20,
	temperament: "nice"
},function(err,cat){
	if(err){
		console.log(err);
	}
	else {
		console.log(cat);
	}
});

Cat.find({},function(err,cats){
	if(err){
		console.log("Error");
		console.log(err);
	}
	else {
		console.log(cats);
	}
});
