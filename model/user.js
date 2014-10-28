var pool = require('./db');

function User(name, passport, email, password, contact) {
	this.name = name;
	this.passport = passport;
	this.email = email;
	this.password = password;
	this.contact = contact;
}

User.getAll = function(callback) {
	pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from passenger ', function(err, rows, fields) {
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

User.get = function(email, callback) {
	pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('SELECT * from passenger where ?', {
      "email": email
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

User.prototype.add = function(callback) {
	console.log(this.name);
	var user = {
		name : this.name,
		passport : this.passport,
		email : this.email,
		password : this.password,
		contact : this.contact
	};

	pool.getConnection(function(err, connection) {
		connection.query('INSERT INTO passenger SET ?', user, function(err, rows, fields) {
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

module.exports = User;