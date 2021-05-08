const mongoose = require('mongoose');

const name = new mongoose.Schema({
    name:{
        type:String
    }
});


module.exports = User = mongoose.model('user', name);