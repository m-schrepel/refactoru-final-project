var mongoose = require('mongoose');
var UserModel = require('../models/userModel')

var userSchema = new mongoose.Schema({
	userid: String,
	username: String,
	profile: Object,
	vendor: Number
});

var UserModel = module.exports = mongoose.model('user', userSchema);
