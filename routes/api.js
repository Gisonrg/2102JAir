var express = require('express');
var router = express.Router();

var Plane = require("../model/plane.js");
var Airport = require("../model/airport.js");
var User = require("../model/user.js");
var Flight = require("../model/flight.js");
var Seat = require("../model/seat.js");

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

function convertDateString(time) {
	return time.replace(/\//g, "-");
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

router.get('/flights/:fno', function(req, res) {
	Flight.get({
		"fno": req.params.fno
	}, function(err, data) {
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

function parseDate(date) {
	var day = date.split('/');
	var output = new Date();
	output.setFullYear(day[0]);
	output.setMonth(day[1]-1);
	output.setDate(day[2]);
	return output;
}

function convertDateString(date) {
	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}
function daydiff(first, second) {
	return Math.floor((second-first)/(1000*60*60*24))+1;
}

router.get('/seats', function(req,res) {
	if (Object.keys(req.query).length==0) {
		Seat.getAll(function(error, data){
			res.send(data);
		});
	} else {
		console.log(req.query);
		Seat.search(req.query, function(error, data){
			res.send(data);
		});
	}
	
});


router.post('/seats', function(req, res) {
	var flight_no = req.body.flight;
	var startDay = parseDate(req.body.fromDate);
	var endDay = parseDate(req.body.toDate);

	var no_first = parseInt(req.body.no_first);
	var price_first = req.body.price_first;

	var no_biz = parseInt(req.body.no_biz);
	var price_biz = req.body.price_biz;

	var no_econ = parseInt(req.body.no_econ);
	var price_econ = req.body.price_econ;

	Flight.get({
		"fno": flight_no
	}, function(err, data) {
		if (err) {

		} else {
			var totalSeats = data[0].seats;
			if ((no_first + no_biz + no_econ) != totalSeats) {
				req.flash('error', "Your total seats entered should equal to number of seats of the plane.");
				return res.redirect('/admin/seat');
			} else {
				// how many days to add
				var days = daydiff(startDay, endDay);

				var current_day = startDay;

				for (var i = 0; i < days; i++) {
					var today = convertDateString(current_day);
					// add first class seats
					for (var j = 0; j < no_first; j++) {
						var newSeat =
							new Seat("F" + (j + 1), flight_no, today, "First", "TRUE", price_first);
						newSeat.save(function(err) {
							if (err) {
								console.log(err);
							}
						});
					}
					// add biz class seats
					for (var j = 0; j < no_biz; j++) {
						var newSeat =
							new Seat("B" + (j + 1), flight_no, today, "Business", "TRUE", price_biz);
						newSeat.save(function(err) {
							if (err) {
								console.log(err);
							}
						});
					}
					// add econ class seats
					for (var j = 0; j < no_econ; j++) {
						var newSeat =
							new Seat("E" + (j + 1), flight_no, today, "Economy", "TRUE", price_econ);
						newSeat.save(function(err) {
							if (err) {
								console.log(err);
							}
						});
					}
					current_day.setDate(current_day.getDate() + 1);
				};
				req.flash('success', "Added successfully.");
				return res.redirect('/admin/seat');
			}
		}
	});
});




router.get('/flights/:id', function(req, res) {
	res.send('getting a flight information');
});

module.exports = router;