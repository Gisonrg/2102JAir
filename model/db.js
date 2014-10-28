var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'jairadmin',
	password: 'cs2102jair',
	port: '8889',
	database: 'jair'
});
module.exports = pool;