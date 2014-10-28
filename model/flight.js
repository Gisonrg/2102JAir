var pool = require('./db');

function Flight(fno, depart, arrive, duration, origin, destination, plane_id) {
  this.fno = fno;
  this.depart = depart;
  this.arrive = arrive;
  this.duration = duration;
  this.origin = origin;
  this.destination = destination;
  this.plane_id = plane_id;
}

Flight.getAll = function(callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from flight', function(err, rows, fields) {
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

Flight.remove = function(fno, callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('DELETE from flight where ?', fno, function(err,
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

Flight.prototype.save = function(callback) {
  var flight = {
    fno : this.fno,
    depart_time : this.depart,
    arrive_time : this.arrive,
    duration : this.duration,
    origin : this.origin,
    destination : this.destination,
    plane_id : this.plane_id
  };

  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('INSERT INTO flight SET ?', flight, function(err,
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

module.exports = Flight;