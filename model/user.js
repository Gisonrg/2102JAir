var pool = require('./db');

function User(name, passport, email, password, contact) {
	this.name = name;
	this.passport = passport;
	this.email = email;
	this.password = password;
	this.contact = contact;
	this.title = null;
	this.dateOfBirth = null;
	this.passportExpDate = null;
	this.address = null;
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
		connection.query('SELECT * FROM passenger WHERE ?', {
			"email": email
		}, function(err, rows, fields) {
			if (err) {
				return callback(err.code, null);
			}
			callback(null, rows);
			connection.release();
		});
	});
};

User.update = function(email, title, name, contact, passport, passportExpDate, dateOfBirth, address, callback){
	pool.getConnection(function(err,connection){
		connection.query('UPDATE passenger SET title = ?, name = ?, contact = ?, passport = ?, passportExpDate = ?, dateOfBirth= ? , address= ?  WHERE email= ? ', 
			[title, name, contact, passport, passportExpDate, dateOfBirth, address, email], 
			function(err, rows, fields){
			if(err){
				console.log(err);
				return callback(err.code, null);			
			}
			callback(null, rows);
			connection.release();
		});
	});
};

User.prototype.add = function(callback) {
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
			console.log(output);
			callback(null, output);

			connection.release();
		});
	});
};

module.exports = User;