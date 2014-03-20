var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var UserModel = require('../models/userModel');
passport.serializeUser(function(user, done){
	done(null, user._id);
});
passport.deserializeUser(function(userid, done){
	UserModel.findOne({_id: userid}, function(err, user){
		done(err, user);
	});
});
passport.use(new FacebookStrategy({
	// clientID: '533663253414478',
	// clientSecret: '736501736ce5cf7c7f8bf94bd06b9d63',
	// callbackURL: 'http://localhost:5000/facebook/callback'
	clientID: '522444067866828',
	clientSecret: 'df98efb72eff76d49b365c522aaf00e7',
	callbackURL: 'http://www.pingatruck.com/facebook/callback'
}, function(accessToken, refreshToken, profile, done){
	UserModel.findOne({userid: profile.id}, function(err, user){
		if(user){
			return done(err, user);
		}
		var newUser = new UserModel({
			userid: profile.id,
			username: profile.username,
			profile: profile,
		});
		newUser.save(function(err, doc){
			return done(err, doc);
		});
	});
}));
passport.use(new GoogleStrategy({
    clientID: '844209823006-s1n8k91ghivqjeopup7bn7vgum30n20s@developer.gserviceaccount.com',
    clientSecret: 'KXo7FoQT2q4Z1hPrNKkbfEPL',
    callbackURL: "http://www.pingatruck.com/oauth2callback"
    // clientID: '844209823006-4ti4bums62jpt34gni79o003je50ft0f.apps.googleusercontent.com',
    // clientSecret: 'K2Y7SlerscvPqJ7YnR5kmhcb',
    // callbackURL: "http://localhost:5000/oauth2callback"
},
   function(accessToken, refreshToken, profile, done) {
 		UserModel.findOne({ userid: profile.id }, function (err, user) {
 			if(user){
 				return done(err, user);
 			}
 			var newUser = new UserModel({
				userid: profile.id,
  				username: profile.displayName,
  				profile: profile
 			});
			newUser.save(function(err, doc){
				return done(err, doc);
  			});
      });
    }
));