var express = require("express");
var app = express();
const axios = require('axios');

app.set("view engine", "ejs");

app.get("/",function(req,res){
	res.render("search");	
});

app.get("/results",function(req,res){
	var q = req.query.search;
	var url = "https://jsonplaceholder.typicode.com/users/" + q;
	axios.get(url)
	  .then(function(response){
			var p = response.data;
			res.render("results",{data:p});
	   })
	  .catch(function(error){
		console.log(error);
	  })
	  .finally(function(){
	  });
});

app.listen(process.env.PORT || 3000, process.env.IP, function() { 
	console.log('Server listening on port 3000'); 
});