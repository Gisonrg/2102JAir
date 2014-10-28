var express = require('express');
var router = express.Router();
var Plane = require("../model/plane.js");
var Airport = require("../model/airport.js");
var User = require("../model/user.js");
var Flight = require("../model/flight.js");

function dateCompare(time1,time2) {
  var t1 = new Date();
  var parts = time1.split(":");
  t1.setHours(parts[0],parts[1],0,0);
  var t2 = new Date();
  parts = time2.split(":");
  t2.setHours(parts[0],parts[1],0,0);

  return  (t2 - t1) / 1000 / 60; // in minutes
}

function convertTimeString(time) {
  return time+":00";
}

function convertToDisplayString(time) {
   var parts = time.split(":");
   return parts[0]+":"+parts[1];
}


/* GET a list of users */
router.get('/users', function(req, res) {
	User.getAll(function(err, data) {
		if (err) {
			res.json({
				"status": "error",
				"error": err.code
			});
		} else {
			res.json(data);
		}
	})
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
	Flight.getAll(function(err, data) {
		if (err) {
			res.json({
				"status": "error",
				"error": err.code
			});
		} else {
			res.json(data);
		}
	});
});

router.post('/flights', function(req, res) {
	var duration = dateCompare(req.body.depart_time, req.body.arrive_time);
	var flight = 
	new Flight(
		req.body.fno,
		convertTimeString(req.body.depart_time),
		convertTimeString(req.body.arrive_time),
		duration,
		req.body.from,
		req.body.to,
		req.body.plane
	);

	flight.save(function(err) {
		if (err) {
			req.flash('error', err.code);
		} else {
			req.flash('success', "Added successfully.");
		}
		res.redirect('/admin/flight');
	});
});

router.get('/flights/:id', function(req, res) {
	res.send('getting a flight information');
});

module.exports = router;