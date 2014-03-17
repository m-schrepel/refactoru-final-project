var mongoose = require('mongoose');
var UserModel = require('../models/userModel')

var userSchema = new mongoose.Schema({
	userid: String,
	username: String,
	email: String,
	text: String,
	profile: Object,
	vendor: Number,
	where: String,
	startTime: String,
	endTime: String,
	form: {}
});

var UserModel = module.exports = mongoose.model('user', userSchema);