var express = require('express');
var app = express();
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});


//var html = html();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get('/', function (req, res) {
   res.send('welcome');
})

app.get('/newuser', function (req, res) {
	res.render('register', {});
})

app.get('/user', function (req, res) {
	console.log(req.params.aadhar);
	MongoClient.connect(url, function(err, db) {
   		if (err) throw err;
   		db=db.db("mydb");
	  	db.collection("users").find({'aadhar':req.query.aadhar}).toArray(function(err, result) {
		    if (err) throw err;
		    console.log(result);
		    res.send(JSON.stringify(result[0]));
		    //db.close();
		});
	   
	});
})

app.get('/users', function (req, res) {
   //res.send('Hello World');
   MongoClient.connect(url, function(err, db) {
   		if (err) throw err;
   		db=db.db("mydb");
	  	db.collection("users").find().toArray(function(err, result) {
		    if (err) throw err;
		    console.log(result);
		    res.render('users', {list:result});
		    //db.close();
		});
	   
	});
})
app.post('/entervalues', function (req, res) {
   //res.send('enter values');
   var user={'aadhar':req.body.aadhar,'name':req.body.name,'dob':req.body.dob,'email':req.body.email,'area':req.body.home,'amount':req.body.amount};
   console.log("user-"+user);
   MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db=db.db("mydb");
	  	console.log("Database created!");
		db.collection("users").insertOne(user, function(err, res) {
	    	if (err) throw err;
	    	console.log("1 document inserted");
	    	//db.close();
	  	});
	});
  	res.send('value entered');

})

app.post('/deleteuser', function (req, res) {
   //res.send('enter values');
   var q={'email':req.body.email};
   MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db=db.db("mydb");
	  	console.log("Database created!");
		db.collection("users").deleteOne(q, function(err, res) {
	    	if (err) throw err;
	    	console.log("1 document removed");
	    	//db.close();
	  	});
	});
  	MongoClient.connect(url, function(err, db) {
   		if (err) throw err;
   		db=db.db("mydb");
	  	db.collection("users").find().toArray(function(err, result) {
		    if (err) throw err;
		    console.log(result);
		    res.render('users', {list:result});
		    //db.close();
		});
	   
	});

})

var server=app.listen(3000,function() {});