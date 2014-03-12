module.exports = {
	index: function(req, res){
		res.render('index', {
			title: 'Passport App',
			username: 'Chris'
		});
	},
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
		res.render('signup');
	}
};