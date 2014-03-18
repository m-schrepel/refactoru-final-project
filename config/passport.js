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
	clientID: '524785800972097',
	clientSecret: '1c0a3b9d4b50b6f9c8f24f2e27793e04',
	callbackURL: 'http://ping-a-truck.herokuapp.com//facebook/callback'
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
    clientID: '844209823006.apps.googleusercontent.com',
    clientSecret: 'LSJoJGZmk_0ex33Rxhki8gtd',
    callbackURL: "http://ping-a-truck.herokuapp.com/oauth2callback"
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