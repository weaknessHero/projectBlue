/*
실행 방법 
1. cmd 를 통해 npm install mongodb 를 실행한다.
2. cmd 를 통해 폴더 위치를 변경하고 express (폴더이름)을 통해 설치해준다
3. cmd 를 통해 npm install을 해준다.
4. cmd 를 통해 node main.js 을 해준다.
4. 
*/
const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');
const app = express();
const templet = require('./templet.js');

const searchBar= templet.searchBar();

var MongoClient = require('mongodb').MongoClient;
var DBurl = "mongodb://localhost:27017/DataBase";

MongoClient.connect(DBurl , function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();

});

app.use(express.static('static'));

app.get('/',(req, res) => {
  var html=templet.HTML(`execution.js`, `design.css`, searchBar,`<img src="/logo.jpg">`);
  res.send(html);
});

app.get('/search/:searchID',(req, res) => {
  var html=templet.HTML(`execution.js`, `design.css`, searchBar, req.searchID);
  res.send(html);
});

app.get('/stockCode/:stockCodeID',(req, res) => {
  var html=templet.HTML(`execution.js`, `design.css`, searchBar, req.stockCodeID);
  res.send(html);
});

app.listen(8080, function() {
  console.log('Example app listening on port 3000!')
});

