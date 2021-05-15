var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const fs = require('fs');

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection('stockId', function(err, res) {
    fs.readFile('./static/corpCodeData.csv','utf8', function(err, data){
      //data string conversion to arr
      var des = data.split("\r\n");
      
      des.shift();
      des.pop();
      
      var i = des.length;
      while(i--){
        des[i]=des[i].split(',');
      
        dbo.collection('stockId').insertOne({name:des[i][0],stockCode:des[i][1]}, function(err, db){
          if(err) throw err;
        });
      
      }
    });
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});


