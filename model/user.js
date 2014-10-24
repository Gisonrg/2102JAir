var pool = require('./db');

function User(pid, name, passport, email, password, contact) {
	this.pid = pid;
	this.name = name;
	this.passport = passport;
	this.email = email;
	this.password = password;
	this.contact = contact;
}

User.get = function(pid, callback) {
	pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from passenger where ?', {
      "pid": pid
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

module.exports = User;