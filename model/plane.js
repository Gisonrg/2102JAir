var pool = require('./db');

function Plane(aid, type, seats) {
  this.aid = aid;
  this.type = type;
  this.seats = seats;
}

Plane.getAll = function(callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from airplane', function(err, rows, fields) {
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

Plane.remove = function(plane, callback) {
  console.log(plane.aid);
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('DELETE from airplane where ?', plane, function(err, rows, fields) {
      if (err) {
        console.log(err);
        return callback(err.code);
      }
      callback(null);
      connection.release();
    });
  });
};

Plane.prototype.save = function(callback) {
  var plane = {
      aid: this.aid,
      type: this.type,
      seats: this.seats
  };
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('INSERT INTO airplane SET ?', plane, function(err, result) {
      if (err) {
        console.log(err);
        return callback(err.code);
      }
      callback(null);
      connection.release();
    });
  });
};

module.exports = Plane;