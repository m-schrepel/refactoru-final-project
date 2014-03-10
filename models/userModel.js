var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userid: String,
	username: String,
	profile: Object
});

var UserModel = module.exports = mongoose.model('user', userSchema);