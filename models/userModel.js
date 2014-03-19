var mongoose = require('mongoose');
var UserModel = require('../models/userModel')

var userSchema = new mongoose.Schema({
	userid: String,
	username: String,
	notifyEmail: Boolean,
	email: String,
	notifyText: Boolean,
	text: String,
	profile: Object,
	vendor: Number,
	where: {
		k: Number,
		A: Number
	},
	startTime: String,
	endTime: String,
	form: {}
});

var UserModel = module.exports = mongoose.model('user', userSchema);