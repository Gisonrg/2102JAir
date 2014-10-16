var express = require('express');
var router = express.Router();
var Plane = require("../model/plane.js");

/* GET Admin control page. */
router.get('/', function(req, res) {
	res.render('admin', { 
		title: 'J-Air Admin Dashboard',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});
router.get('/airport', function(req, res) {
	res.render('admin-airport', {
		title: 'J-Air Admin | Manage Airport',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.get('/plane', function(req, res) {
      res.render('admin-plane', {
        title: 'J-Air Admin | Manage Plane',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
      });
});

router.get('/user', function(req, res) {
	res.render('admin-user', {
		title: 'J-Air Admin | Manage User',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.get('/flight', function(req, res) {
	res.render('admin-flight', {
		title: 'J-Air Admin | Manage Flight',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.get('/booking', function(req, res) {
	res.render('admin-booking', {
		title: 'J-Air Admin | Manage Booking',
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

module.exports = router;
