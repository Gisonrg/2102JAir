var pool = require('./db');

function Admin(username, name, password, status) {
  this.username = username;
  this.name = name;
  this.password = password;
  this.status = status;
}

Admin.get = function(username, callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from administrator where ?', {
      "username": username
    }, function(err, rows, fields) {
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

module.exports = Admin;