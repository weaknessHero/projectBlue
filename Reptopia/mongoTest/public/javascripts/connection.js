const mongoose = require('mongoose');

const URI = "mongodb+srv://dbUser:dbUserpassword@cluster0.f5csc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectDB = function(){
    mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true});
    console.log('Database connected!');
};

module.exports = connectDB;