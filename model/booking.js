var pool = require('./db');

var Airport = require('./airport.js');
var Flight = require('./flight.js');
var Seat = require('./seat.js');

function Booking(book_ref, seat_id, flight_no, flight_time, passenger_id) {
	this.book_ref = book_ref;
	this.seat_id = seat_id;
	this.flight_no = flight_no;
	this.flight_time = flight_time;
	this.passenger_id = passenger_id;
}

Booking.generateREF = function() {
	function makeid() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}
	return makeid();
}

Booking.getAll = function(callback) {
	pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from reservation, seat, passenger, flight where reservation.seat_id = seat.sid and passenger.pid = reservation.passenger_id and reservation.flight_no = seat.flight_no and seat.flight_no = flight.fno and reservation.flight_time = seat.flight_time ORDER BY book_time DESC',
    	function(err, rows, fields) {
    		if (err) {
    			return callback(err.code, null);
    		}

    		var output = [];
    		for (var i in rows) {
    			output.push(rows[i]);
    		}
    		callback(null, output);

    		connection.release();
    	});
});
};

Booking.get = function(book_ref, callback) {
	pool.getConnection(function(err, connection) {
		connection.query('SELECT * from reservation, seat, passenger, flight where reservation.seat_id = seat.sid and passenger.pid = reservation.passenger_id and reservation.flight_no = seat.flight_no and seat.flight_no = flight.fno and reservation.flight_time = seat.flight_time and ?',
		{
			"book_ref": book_ref
		}, function(err, rows, fields) {
			if (err) {
				return callback(err.code, null);
			}
			callback(null, rows);
			connection.release();
		});
	});
};

Booking.manage = function(email, callback){
	pool.getConnection(function(err, connection) {
		connection.query('SELECT * from reservation, seat, passenger, flight where reservation.seat_id = seat.sid and passenger.pid = reservation.passenger_id and reservation.flight_no = seat.flight_no and seat.flight_no = flight.fno and reservation.flight_time = seat.flight_time and ?',
		{
			"passenger.email": email
		}, function(err, rows, fields) {
			if (err) {
				return callback(err.code, null);
			}
			callback(null, rows);
			connection.release();
		});
	});
};

// only change seats allowed
// changes: [{new seat}, book_ref]
Booking.update = function(changes, callback) {
	pool.getConnection(function(err, connection) {
		var newquery = 'UPDATE reservation SET ? where book_ref = ?'
		connection.query(newquery, changes, function(err,
			result) {
			if (err) {
				console.log(err);
				return callback(err.code);
			}
			callback(null);
			connection.release();
		});
	});
};

Booking.remove = function(booking, callback) {
	pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('DELETE from reservation where ?', booking, function(err,
    	rows, fields) {
    	if (err) {
    		console.log(err);
    		return callback(err.code);
    	}
    	callback(null);
    	connection.release();
    });
});
};

Booking.prototype.add = function(callback) {
	var booking = {
		book_ref : this.book_ref,
		seat_id : this.seat_id,
		flight_no : this.flight_no,
		flight_time : this.flight_time,
		passenger_id : this.passenger_id
	};
	pool.getConnection(function(err, connection) {
		connection.query("INSERT INTO reservation SET ?", booking, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return callback(err.code, null);
			}
			var output = [];
			for (var i in rows) {
				output.push(rows[i]);
			}
			callback(null, output);

			connection.release();
		});
	});
};

module.exports = Booking;