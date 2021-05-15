var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) console.log(err);
  var dbo = db.db("stoker");
  dbo.createCollection("stockId", function(err, res) {
    if (err) console.log(err);
    console.log("Collection created!");
    db.close();
  });
});


fs.readFile('./static/corpCodeData.csv','utf8', function(err, data){
  //data string conversion to arr
  var des = data.split("\r\n");


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");

  var dbo = db.db("stoker");

  des.shift();
  des.pop();

  var i = des.length;

  while(i--){
    des[i]=des[i].split(',');

    dbo.collection('stockId').insertOne({name:des[i][0],stockCode:des[i][1]}, function(err, abcd){
      if(err) throw err;
    });
  
  }

  db.close();
});



});

/*



*/