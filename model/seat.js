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
    connection.query('SELECT * FROM seat WHERE ? ', sid,function(err, rows, fields) {
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

function prepareQuery(condition) {
  var query = "";
  var length = Object.keys(condition).length;
  var count = 0;
  for (var entry in condition) {
    query+=entry+" = '"+condition[entry]+"'";
    if ((count+1)<length) {
      query+=" AND ";
    }
    count++;
  }
  return query;
}

Seat.search = function(condition, callback) {
  var query = 'SELECT sid, flight_no, DATE_FORMAT(flight_time, "%Y/%m/%d") AS flight_time, seat_class, available, price FROM seat WHERE '+prepareQuery(condition);
  query+=" ORDER BY sid"
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(query, function(err, rows, fields) {
      if (err) {
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

Seat.searchFlight = function(totalPeople, condition, callback) {
  var query = 'SELECT DISTINCT fno, depart_time, arrive_time, origin, destination, DATE_FORMAT(flight_time, "%Y/%m/%d") AS flight_time, price 
               FROM seat, flight 
               WHERE seat.flight_no=flight.fno AND '+prepareQuery(condition);
  query += " AND " + totalPeople +" < (SELECT COUNT(*) 
                                       FROM seat, flight 
                                       WHERE seat.flight_no=flight.fno AND seat.available=\'TRUE\' AND "+prepareQuery(condition) + ")";
  console.log(query);
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(query, function(err, rows, fields) {
      if (err) {
        console.log(err);
        return callback(err.code, null);
      }
      var output = [];
      for (var i in rows) {
        rows[i].passengers=totalPeople;
        output.push(rows[i]);
      }
      console.log(output);
      callback(null, output);
      connection.release();
    });
  });
};

Seat.getAvailable = function(condition, callback) {
  var query = 'SELECT COUNT(*) FROM seat, flight WHERE seat.flight_no=flight.fno AND seat.';
}

Seat.remove = function(sid, callback) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('DELETE FROM seat WHERE ?', sid, function(err,
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