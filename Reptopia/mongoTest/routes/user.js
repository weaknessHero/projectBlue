const express = require('express');
const User = require('../public/javascripts/user');
const router = express.Router();

router.post('/', async (res) => {
    let name = {};
    name.name = 'name1';
    let userModel = new User(name);
    await userModel.save();
    console.log('route worked!');
    res.json(userModel);
});

module.exports = router;