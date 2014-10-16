var pool = require('./db');

function Airport(code, name, city, country) {
  this.code = code;
  this.name = name;
  this.city = city;
  this.country = country;
}

Airport.getAll = function(callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from airport', function(err, rows, fields) {
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

Airport.remove = function(airport, callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('DELETE from airport where ?', airport, function(err, rows, fields) {
      if (err) {
        console.log(err);
        return callback(err.code);
      }
      callback(null);
      connection.release();
    });
  });
};

Airport.prototype.save = function(callback) {
  var airport = {
      code: this.code,
      name: this.name,
      city: this.city,
      country: this.country
  };
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('INSERT INTO airport SET ?', airport, function(err, result) {
      if (err) {
        console.log(err);
        return callback(err.code);
      }
      callback(null);
      connection.release();
    });
  });
};

module.exports = Airport;