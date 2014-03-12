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
			res.render('protectedvendor');
		}
		else {
			res.send('The form didn\'t submit properly')
		}
	},
	formrender: function(req,res){
		res.render('signup');
	}
};