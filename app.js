//declaring all packages(middleware)
const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();

//setting the engines
app.engine('mustache', mustacheExpress());
app.set('views','./views');
app.set('view engine', 'mustache')
app.use(express.static(__dirname + '/public'));

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/robots';

//getting root host
app.get("/", function(request, respond) {
  MongoClient.connect(url, function(error, db) { //mongo connect to database
    if (error) {
      throw error;
    } else {
      console.log("Successfully connected to the database");
    }
    const data = require("./data");
    for (var i = 0; i < data.users.length; i++) {
      const user = data.users[i];
      db.collection("users").updateOne({
        id: user.id
      }, user, {upsert: true})
    }
    db.collection("users").find().toArray(function(error, documents) {
      respond.render("index", {data: documents})
    })
  })
})


app.get('/hire', function(request, respond){
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    db.collection("users").find({job: null}).toArray(function(err, documents) {
      respond.render("hire", {data: documents})
    })
  })
})



app.get('/taken', function (request, respond){
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    } //$nin means not in - displaying taken users
    db.collection("users").find({job: {$nin: [null]}}).toArray(function(err, documents) {
      respond.render("taken", {data: documents})
    })
  })
})


//get for individual pages of users
app.get('/:id', function (request, respond) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    db.collection("users").find({id: parseInt(request.params.id)}).toArray(function(err, documents) {
      respond.render("user", {data: documents})
    })
  })
})



app.listen(3000, function () {
  console.log('Live from the gutter');
});
