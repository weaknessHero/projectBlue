/*
실행 방법
- cmd 를 통해 npm install을 해준다.
- cmd 를 통해 node main.js 을 해준다.
- mongoDB 사이트를 통해 mongoDB설치
- mongodb 설치된 폴더\bin 폴더에 환경변수 path 설정
- cmd 를 통해 npm install mongodb 를 실행한다.
- cmd 를 통해 폴더 위치를 변경하고 express (폴더이름)을 통해 설치해준다
- data 및 resource 폴더의 일부를 static으로 옮김
*/
const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();
const templet = require('./templet.js');
const searchBar= templet.searchBar();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, db) {

  app.use(express.static('static'));
  

  app.get('/',(req, res) => {
    var html=templet.HTML(`execution.js`, `design.css`, searchBar,`<img src="/logo.jpg">`);
    res.send(html);
  });


  var dbo = db.db("stocker");

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

    app.get('/search',(req, res) => {
      if (req.query.searchId!="") {
        console.log(req.query.searchId)
        dbo.collection("stockId").find({name: new RegExp(req.query.searchId)}).toArray(function(err, result){
            
          var i = result.length;
          var des=`<ul>`
          while(i--){
            des+=`<a href=/stockData?stockCodeID=${result[i].stockCode}><ol>${result[i].name}</ol></a>`
          }
          des+=`</ul>`

          var html=templet.HTML(`execution.js`, `design.css`, searchBar, des);
          res.send(html);
        });
      }
    });
  
    app.get('/stockData',(req, res) => {
      fs.readFile(`./static/detailData/${req.query.stockCodeID}.csv`, 'utf8', function(err, codeData){
        if (err) throw err;
        console.log(req.query.stockCodeID);
        var html=templet.HTML(`execution.js`, `design.css`, searchBar, req.query.stockCodeID, codeData);
        res.send(html);
      });
    });
    
    app.listen(8080, function() {
      console.log('Example app listening on port 8080!')
    });
  });
});