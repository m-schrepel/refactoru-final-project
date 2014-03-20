var mongoose = require('mongoose');
var UserModel = require('../models/userModel');
var sys = require('sys');
TwilioClient = require('twilio').Client;
client = new TwilioClient('AC36c1de397283db095773dbcb9a8cc2d3', '72f4a97aeee50fc81fc99215b74ea886');

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
	verifiedVendor: function(req, res){
		res.render('fullvendor')
	},
	dbSave: function(req, res){
		req.user.where = req.body.where;
		req.user.startTime = req.body.start;
		req.user.endTime = req.body.end;
		req.user.save(function(err, doc) {
			res.send(doc);

		});

	},
	dbGet: function(req, res){
		UserModel.findById(req.user._id, function(err,doc){
			res.send(doc);
		});
	},
	dbDraw: function(req, res){
		UserModel.find({ 
			endTime: {$exists: true}, 
			startTime: {$exists: true}, 
			where: {$exists: true},
			vendor: {$not: {$exists: true}}},
			{endTime: true, 
				startTime: true, 
				where: true, 
				notifyEmail: true, 
				notifyText: true,
				text: true,
				email: true
			}, 
			function(err, doc){
			res.send(doc);
		});
	},
	notify: function(req, res){
		req.user.notifyEmail = req.body.notifyEmail;
		req.user.notifyText = req.body.notifyText;
		req.user.email = req.body.email;
		req.user.text = req.body.text;
		req.user.save();
		res.send(req.body);
	},
	sendText: function(req, res){
			client.messages.create({ 
			to: req.body.text, 
			from: "+14155287571", 
			body: "Hey there " + req.body.username+", "+"the "+req.body.truckName+" is near you from "+req.body.truckstart+" to "+req.body.truckend    
			}, 
			function(err, message) { 
			console.log(err, message); 
		});
		res.send('k');
	},
	sendMail: function(req, res){
		res.send('kk');

	}
};