var express = require('express');
var router = express.Router();var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const Service = require('../models/service');
var User = require('../models/user');


// Obteniendo Servicios DRIVER ROUTE
router.get('/', ensureAuthenticated, nocache, async (req, res, next) => {
  const services = await Service.find();
  res.render('./driver/driver', {
  	services
  });

});


// Asignando servicio a conductor
router.get('/assign', async (req, res)=> {
	const { driver } = req.query;
	const { id } = req.query;
	const service = await Service.findById(id);
	const user = await User.findById(driver);
	const name = user.name;
	const dni = user.dni;
	service.meta.driver = name;
	service.meta.dni = dni;
	await service.save();
	res.redirect('/driver');
});



// Actualizando estado un servicio tomado
router.get('/turn/:id', async (req, res)=> {
	const { id } = req.params;
	const service = await Service.findById(id);
	service.status = !service.status;
	service.meta.hrRe = new Date();
	await service.save();
	res.redirect('/driver');
});

// Actualizando entrega un servicio
router.get('/edit/:id', async (req, res)=> {
	const { id } = req.params;
	const service = await Service.findById(id);
	service.completed = !service.completed;
	service.meta.hrEn = new Date();
	console.log(service);
	await service.save();
	res.redirect('/driver');
});

//Autenticacion
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}
// no cache funcion
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}




module.exports = router;