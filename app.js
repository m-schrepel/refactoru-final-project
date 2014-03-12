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
app.set('port', process.env.PORT || 3000);
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
mongoose.connect('mongodb://localhost/foodTruckUsers');
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res){
	res.render('404.jade');
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.post('/truck-submit', indexController.foodTruckCreate);
app.get('/vendor/login/facebook', function (req, res, next) {
	req.session.vendor = 1;
	next();
}, 	passport.authenticate('facebook'));
app.get('/vendor/auth/google', function (req, res, next) {
	req.session.vendor = 1;
	next();
}, passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login', 
	'https://www.googleapis.com/auth/userinfo.profile', 
	'https://www.googleapis.com/auth/userinfo.email']}));
app.get('/signup', indexController.signup);
app.get('/signupform', indexController.foodTruckCreate);
app.get('/', authController.ensureAuthenticated, indexController.login);
app.get('/login', authController.login);
app.get('/logout', authController.logout);
app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}),
	function(req,res){
		console.log(req.session.vendor);
		if (req.session.vendor) {
			res.redirect('/signupform');
		}
		res.redirect('/user');
	});
app.get('/user', authController.ensureAuthenticated, indexController.user);
app.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login', 
	'https://www.googleapis.com/auth/userinfo.profile', 
	'https://www.googleapis.com/auth/userinfo.email']}));
app.get('/oauth2callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log(req.session.vendor);
    if (req.session.vendor){
    	res.redirect('/signupform');
    }
    res.redirect('/user');
  });
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
