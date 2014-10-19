var express = require('express');
var router = express.Router();
var Plane = require("../model/plane.js");
var Airport = require("../model/airport.js");
/* GET a list of users */
router.get('/users', function(req, res) {
	res.send('getting all users');
});

/* POST create a new user */
router.post('/users', function(req, res) {
	res.send('create a new user');
});

/* GET a user */
router.get('/users/:id', function(req, res) {
	res.send('getting a user whose id is ' + req.params.id);
});

router.get('/plane', function(req, res) {
	Plane.getAll(function(err, data) {
		if (err) {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				"status": "error",
				"error": err
			}));
		} else {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(data));
		}
	});
});

/* POST creates a new plane */
router.post('/plane', function(req, res) {
	var plane = new Plane(req.body.aid, req.body.type, req.body.seats);
	plane.save(function(err) {
		if (err) {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				"status": "error",
				"error": err.code
			}));
		} else {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				"status": "ok"
			}));
		}
	});
});

/* DELETE removes a plane */
router.delete('/plane/:plane_id', function(req, res) {
	Plane.remove({
		"aid": req.params.plane_id
	}, function(err) {
		if (err) {
			res.json({
				"status": "error",
				"error": err.code
			});
		} else {
			res.json({
				"status": "ok"
			});
		}
	});
});

router.get('/airport', function(req, res) {
	Airport.getAll(function(err, data) {
		if (err) {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				"status": "error",
				"error": err
			}));
		} else {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(data));
		}
	});
});

/* POST creates a new airport */
router.post('/airport', function(req, res) {
	var airport = new Airport(req.body.code, req.body.name, req.body.city, req.body.country);
	airport.save(function(err) {
		if (err) {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				"status": "error",
				"error": err.code
			}));
		} else {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				"status": "ok"
			}));
		}
	});
});

/* DELETE removes a airport */
router.delete('/airport/:airport_code', function(req, res) {
	Airport.remove({
		"code": req.params.airport_code
	}, function(err) {
		if (err) {
			res.json({
				"status": "error",
				"error": err.code
			});
		} else {
			res.json({
				"status": "ok"
			});
		}
	});
});



router.get('/flights', function(req, res) {
	res.send('getting all flights');
});

router.get('/flights/:id', function(req, res) {
	res.send('getting a flight information');
});

module.exports = router;