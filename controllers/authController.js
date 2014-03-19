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
		req.session.destroy();
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
	},
	redirectCheck: function(req, res){
	  	if (req.user.vendor === 3) {
	  		res.redirect('/truck')
	  	}
	  	else if (req.user.form || req.user.vendor === 2) {
	  		res.redirect('/vendor2');
	  	}
	  	else if (req.user.vendor===1 || req.session.vendor === 1) {
				req.user.vendor = req.session.vendor;
				req.user.save(function() {
					res.redirect('/signupform');
				});		
	    		return null;
	    }
	    else {
	    res.redirect('/user');
		}
	},
	securityElevate: function(req, res, next){
		req.session.vendor = 1;
		next();
	},
	vendorCheck: function(req, res){
		if (req.user.vendor===3) {
			res.render('fullvendor');
		}
	}
}