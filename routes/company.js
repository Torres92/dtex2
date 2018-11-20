var express = require('express');
var router = express.Router();var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
const Service = require('../models/service');



// Obteniendo Servicios COMPANY ROUTE
router.get('/', ensureAuthenticated, nocache, async (req, res, next) => {
  const services = await Service.find();
  res.render('./company/company', {
  	services
  });

});

// Obteniendo Servicios COMPANY ROUTE
router.get('/add', ensureAuthenticated, async (req, res, next) => {
  res.render('./company/service', {
  });

});

// Solicitando servicios
router.post('/add/:name', async (req, res)=>{
	const { name } = req.params;

	const service = new Service(req.body);
	console.log(service);

    var ori = req.body.ori;
    var dest = req.body.dest;

    // Validation
	req.checkBody('ori', 'Debe colocar origen').notEmpty();
	req.checkBody('dest', 'Debe colocar destino').notEmpty();
   

    var errors = req.validationErrors();

    console.log(errors);
    if (errors) {
    	res.render('./company', {
			errors
		});
    }
    else {
		service.meta.applicant = name;
	    await service.save();
	    req.flash('success_msg', 'Servicio solicitado exitosamente');
		res.redirect('/company');
	}
});

//authentication
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