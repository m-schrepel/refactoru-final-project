var mongoose = require('mongoose');
var UserModel = require('../models/userModel');
module.exports = {
	login: function(req, res){
		res.render('login', {
			title: 'Ping-a-Truck Login'
		});
	},
	user: function(req, res){
		res.render('index');
	},
	signup: function(req, res){
		res.render('vendorBenefits');
	},
	foodTruckCreate: function(req, res){
		req.user.vendor = 2;
		req.user.form = req.body;
		req.user.save();
		if(req.user.form){
			res.redirect('/vendor2');
		}
		else {
			res.send('The form didn\'t submit properly')
		}
	},
	formrender: function(req,res){
		res.render('signup');
	},
	vendor2: function(req, res){
		res.render('protectedvendor')
	},
	vendor3: function(req, res){
		res.render('fullvendor')
	},
	dbSave: function(req, res){
		console.log(req.body);
		req.user.where = req.body.where;
		req.user.startTime = req.body.start;
		req.user.endTime = req.body.end;
		req.user.save(function(err, doc) {
			res.send(doc);

		});

	},
	dbGet: function(req, res){
		console.log('req.user.id:', req.user._id);
		UserModel.findById(req.user._id, function(err,doc){
			console.log(doc);
		UserModel.find({ endTime: {$exists: true}, startTime: {$exists: true}, where: {$exists: true}},{ endTime: true, startTime: true, where: true}, function(err, doc){
			console.log(doc);
		});
		});
	}
};