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
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.use(express.static('static'));


app.get('/',(req, res) => {
  var html=templet.HTML(`execution.js`, `designIndex.css`, `<div class=topDiv><p><a href="/"><img src="/logo.jpg" alt="logo" width="800px" height="300px"></a></p></div>`,templet.searchBar());
  res.send(html);
});

app.get('/search',(req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err; 
    var dbo = db.db("stockerDB");      

    dbo.collection("ID").find({name: new RegExp(req.query.searchId)}).toArray(function(err, result){

      var i = result.length;
      var des=`<div class="searchResult">`
      if((i<1)|(req.query.searchId==="")){
        des=`<p class="announcement">"${req.query.searchId}"에 대한 검색결과를 찾지 못했습니다.</p>`;


      }else{
        des=`<p class="announcement">"${req.query.searchId}"에 대한 검색결과입니다.</p>`;
        while(i--){
          des+=`<div class="resultIndex"><a href=/stockData?stockCodeID=${result[i].stockCode}&searchId=${req.query.searchId}>${result[i].name}</a></div>`
        }
      }

      des+=`</div>`

      var html=templet.HTML(`execution.js`, `design.css`, templet.logo(),templet.searchBar(req.query.searchId), des);
      res.send(html);

    });    
  });
});

app.get('/stockData',(req, res) => {
  fs.readFile(`./static/detailData/${req.query.stockCodeID}.csv`, 'utf8', function(RFErr, fileCodeData){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(CErr, db) {
      if (CErr) throw CErr;
      var dbo = db.db("stockerDB");      
      dbo.collection("ID").findOne({stockCode:req.query.stockCodeID}, function(FErr, result){
        if (FErr) throw FErr;
        var table ="";
        if (RFErr) {
          var html=templet.HTML(`execution.js`, `design.css`, templet.logo() ,templet.searchBar(req.query.searchId),`<p class="announcement">${result.name}의 정보를 찾을수 없습니다.</p>`);
          
        } else{
          table=parsing.CSVtoTable(fileCodeData);
          var html=templet.HTML(`execution.js`, `design.css`, templet.logo() ,templet.searchBar(req.query.searchId), `<p class="announcement">${result.name}</p>`, `<h1>재무제표</h1><div class="scrollDiv">${table}</div><p style="font-size:24px;">- 위의 표기된 수치는 (표기 수치)억을 기준으로 표기되며, 세부 항목에 1이 붙은 경우에는 자회사까지 포함한 결과입니다.</p>`);

        }
        res.send(html);

      });    
    });



  });
});

app.listen(8080, function() {
  console.log('Example app listening on port 8080!')
});
