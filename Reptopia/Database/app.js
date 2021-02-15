const express = require('express');
const mysql = require('mysql');

//Create connection
var db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '123456',
    database: 'nodemysql'
});

db.connect((err, result)=>{
    console.log('MySql Connected...');
    console.dir(result);
});

const app = express();

app.get('/createdb', (req, res) => {
    let sql= 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        console.log(result);
        res.send('database created...');
    })
})

app.listen('3000', ()=> {
    console.log('Server started on port 3000');
});
