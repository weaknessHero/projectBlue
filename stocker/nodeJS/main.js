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

//정적파일 위치 받기 
app.use(express.static(__dirname+'/static'))



/*

var MongoClient = require('mongodb').MongoClient;
var DBurl = "mongodb://localhost:27017/DataBase";

MongoClient.connect(DBurl,{ useUnifiedTopology: true }  , function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();

});
*/
function templetHtml(JS,CSS,...list){
  console.log(list);
  var templet=`<!DOCTYPE html>
  <html lang='ko'>
    <head>
      <meta charset="utf-8">
      <title>STOCKER</title>
      <script src="${JS}" defer></script>
      <link href="${CSS}" rel="stylesheet" type="text/css">
    </head>
    <body>
      <div class="smallLogo"><a href=""><img src="static/logo2.jpg" alt="메인 로고 사진"></a></div>
      <div class="searchBar"><input type="text"><button><img src="static/logo.jpg"width="50" height="50"alt="검색버튼"></button></div>
      `
  for (var i in list){
    console.log(i);
    templet+=list[i];
  }
      
  templet+= `
    </body>
  </html> `;

  return templet;
}

var _app= http.createServer(function(req,res){
  var _url= req.url;
  
  //queryData에서 받는 값을 통해 사이트 디자인을 구분
  var queryData = url.parse(_url, true).query;
  var templet = ``;
  var list ='';

  if((queryData.search===undefined)&(queryData.id===undefined)){
    //홈페이지일경우

    templet=templetHtml(`execution.js`, `design.css`, list);
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});;
    res.end(templet);

  }else if(queryData.search!=undefined){
    //서치페이지일경우
    
    templet=templetHtml(`execution.js`, `design.css`,`<div class="information"> ${queryData.search}검색에 관련된 정보입니다.<div>`);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(templet);

  }
  else if(queryData.id!=undefined){
    //데이터 페이지일경우
    templet=templetHtml(`execution.js`, `design.css`, `<div class="information"> ${queryData.id}에 관련된 정보입니다.<div>`);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(templet);


  }else{
    res.writeHead(404);
    res.end('찾을수 없습니다.');
  }
  //요청시 오류값 처리
  if(req.url == '/favicon.ico'){
    return res.writeHead(404);
  }

}).listen(8080);
