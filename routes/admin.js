var express = require('express');
var router = express.Router();var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const Service = require('../models/service');
var User = require('../models/user');


// Obteniendo Servicios ADMIN ROUTE
router.get('/', ensureAuthenticated, async (req, res, next) => {
  const services = await Service.find();
  const users = await User.find();
  res.render('./admin/admin', {
  	services,
  	users
  });

});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var username = req.body.username;
	var dni = req.body.dni;
	var tlf = req.body.tlf;
	var email = req.body.email;
	var role = req.body.role;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('role', 'Role is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('dni', 'Dni is required').notEmpty();
	req.checkBody('tlf', 'tlf is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('./admin/admin', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('./admin/admin', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						role: role,
						username: username,
						password: password,
						dni: dni,
						tlf: tlf
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         		req.flash('success_msg', 'Registro exitoso');
					res.redirect('/admin');
				}
			});
		});
	}
});



passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});


// Borrando un servicio
router.get('/delete/:id', async (req, res)=> {
	const { id } = req.params;
	await Service.remove({_id: id});
	res.redirect('/admin');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

//no cache funcion
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}


module.exports = router;