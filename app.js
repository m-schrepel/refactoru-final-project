var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var passportConfig = require('./config/passport');
var indexController = require('./controllers/indexController');
var authController = require('./controllers/authController');
var app = express();
var MongoStore = require('connect-mongo')(express);




// all environments
// app.set('port', process.env.PORT || 3000);
var port = Number(process.env.PORT || 5000);
app.listen(port, function(){
	console.log('listening on ' + port);
});
var MONGOHQ_URL="mongodb://heroku:U-Fl5kqnEiBkgSmkSirSXF-Z2Twy6BHmMMALPUOz9oiodGjKTPtPdVDVrFpxSwzkE14xVGmHFhAgAAs6g1eMJQ@oceanic.mongohq.com:10098/app23118522"
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	store: new MongoStore({
		url: 'mongodb://localhost/foodTruckUsers',
		collection: 'users'
	}),
	secret: 'M0nk3y4SS'}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGOHQ_URL);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res){
	res.render('404.jade');
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/dbGet', indexController.dbGet);
app.post('/dbsubmit', indexController.dbSave);
app.post('/truck-submit', indexController.foodTruckCreate);
app.get('/vendor2', indexController.vendor2);
app.get('/vendor/login/facebook', authController.securityElevate, passport.authenticate('facebook'));
app.get('/vendor/auth/google', authController.securityElevate, passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login', 
	'https://www.googleapis.com/auth/userinfo.profile', 
	'https://www.googleapis.com/auth/userinfo.email']}));
app.get('/signup', indexController.signup);
app.get('/signupform', indexController.formrender);
app.get('/', authController.ensureAuthenticated, indexController.login);
app.get('/login', authController.login);
app.get('/logout', authController.logout);
app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}), authController.redirectCheck);
app.get('/user', authController.ensureAuthenticated, indexController.user);
app.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login', 
	'https://www.googleapis.com/auth/userinfo.profile', 
	'https://www.googleapis.com/auth/userinfo.email']}));
app.get('/oauth2callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), authController.redirectCheck);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
