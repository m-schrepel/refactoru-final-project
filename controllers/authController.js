module.exports = {
	login: function(req, res){
		if(req.isAuthenticated()){
			res.redirect('/user');
		} else {
			res.render('login', {title: 'Ping-a-Truck Login'});
		}
	},
	loginSuccess: function(req, res){
		res.redirect('/user');
	},
	logout: function(req, res){
		req.logout();
		res.redirect('/login');
	},
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/login');
	},
	ensureAuthenticatedAjax: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.send(401);
	}
}