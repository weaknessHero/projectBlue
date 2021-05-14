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

/*
1.4.5
1. 일부 생성및 모듈화 
2. mongoDB 일단 분리(후에 구조 변경)

*/
const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();

const templet = require('./modules/templet.js');
const parsing= require('./modules/parsing.js')

const searchBar= templet.searchBar();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.use(express.static('static'));


app.get('/',(req, res) => {
  var html=templet.HTML(`execution.js`, `design.css`, searchBar,`<img src="/logo.jpg">`);
  res.send(html);
});

app.get('/search',(req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err; 
    var dbo = db.db("stocker");      
    if (req.query.searchId!="") {
      console.log(req.query.searchId)
      dbo.collection("stockId").find({name: new RegExp(req.query.searchId)}).toArray(function(err, result){
          
        var i = result.length;
        var des=`<ul>`
        while(i--){
          des+=`<h2><a href=/stockData?stockCodeID=${result[i].stockCode}><ol>${result[i].name}</ol></a></h2>`
        }
        des+=`</ul>`

        var html=templet.HTML(`execution.js`, `design.css`, searchBar, des);
        res.send(html);
      });
    }
  });
});

app.get('/stockData',(req, res) => {
  fs.readFile(`./static/detailData/${req.query.stockCodeID}.csv`, 'utf8', function(err, codeData){
    var table ="";
    if (err) {
      table="";
      
    } else{
      table=parsing.CSVtoTable(codeData);
    }

    console.log(req.query.stockCodeID);
    var html=templet.HTML(`execution.js`, `data.css`, searchBar, req.query.stockCodeID, table);
    res.send(html);
  });
});

app.listen(8080, function() {
  console.log('Example app listening on port 8080!')
});
