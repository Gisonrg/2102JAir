var pool = require('./db');

function Seat(sid, flight_no, flight_time, seat_class, available, price) {
  this.sid = sid;
  this.flight_no = flight_no;
  this.flight_time = flight_time;
  this.seat_class = seat_class;
  this.available = available;
  this.price = price;
}

Seat.get = function(sid, callback) {
  pool.getConnection(function(err, connection) {
    console.log(fno);
    // Use the connection
    connection.query('SELECT * from seat where ? ', sid,function(err, rows, fields) {
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

Seat.getAll = function(callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from seat', function(err, rows, fields) {
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

Seat.search = function(condition, callback) {
  console.log("condition: " + condition);
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from seat where ?', condition, function(err, rows, fields) {
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

Seat.remove = function(sid, callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('DELETE from seat where ?', sid, function(err,
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

Seat.prototype.save = function(callback) {
  var seat = {
    sid: this.sid,
    flight_no: this.flight_no,
    flight_time: this.flight_time,
    seat_class: this.seat_class,
    available: this.available,
    price: this.price
  };

  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('INSERT INTO seat SET ?', seat, function(err,
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

module.exports = Seat;