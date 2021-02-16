var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

app.listen('3000', ()=> {
    console.log('Server started on port 3000');
});

//Create connection
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'Wnd120412!',
    database: 'object'
});

connection.connect((err)=> {
    if(err){
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

for(let i=0; i<100; i++){
    values = randomObject();

    connection.query('INSERT INTO creature VALUE('+values+');', function (err, res, fields){
        if(err){
            console.error('error query: ' + err.stack);
            return;
        }
        console.log(res);
    });
}

connection.end();

function randomObject(){
    let mess   = Math.floor(Math.random()*2) + 1;
    let width  = Math.floor(Math.random()*25) + 10;
    let height = Math.floor(Math.random()*20) + 5;
    let color  = [Math.floor(Math.random()*80), Math.floor(Math.random()*80), Math.floor(Math.random()*255)];
    let x = Math.floor(Math.random()*100);
    let y = 1;
    let z = 1;
    let speed = Math.floor(Math.random() * 10) + 2;

    return String(x) + ',' + String(y) + ',' + String(z) + ',' + String(mess) + ',' + String(width) + ',' + String(height) + ',' + '"(' + String(color) + ')"' + ',' + String(speed);
}