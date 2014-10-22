CREATE TABLE passenger (
	pid INTEGER PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL,
	passport VARCHAR(9) NOT NULL,
	email VARCHAR(256) NOT NULL UNIQUE,
	password VARCHAR(40),
	contact VARCHAR(32)
);

CREATE TABLE administrator (
	username VARCHAR(16) NOT NULL PRIMARY KEY,
	name VARCHAR(128) NOT NULL,
	password VARCHAR(40) NOT NULL,
	status CHAR(5) CHECK(status='hired' OR status='fired')
);

CREATE TABLE airplane (
	aid CHAR(6) PRIMARY KEY, 
	type VARCHAR(32) NOT NULL,
	seats INTEGER
);

CREATE TABLE airport (
	code CHAR(3) PRIMARY KEY,
	name VARCHAR(256) NOT NULL,
	city VARCHAR(64) NOT NULL,
	country VARCHAR(64)
);

CREATE TABLE flight (
	fno CHAR(5) NOT NULL, 
	depart_time TIMESTAMP NOT NULL,
	arrive_time TIMESTAMP NOT NULL,
	duration INTEGER NOT NULL,
	origin CHAR(3) REFERENCES airport(code) ON DELETE CASCADE,
	destination CHAR(3) REFERENCES airport(code) ON DELETE CASCADE,
	plane_id CHAR(6) REFERENCES airplane(aid) ON DELETE CASCADE,

	PRIMARY KEY(fno, depart_time)
);

CREATE TABLE seat (
	sid CHAR(3) NOT NULL,
	flight_no CHAR(5), 
	flight_time TIMESTAMP,
	seat_class VARCHAR(10) 
		CHECK(seat_class='First' OR seat_class='Business' OR seat_class='Economy'),
	available VARCHAR(6) CHECK(available = 'TRUE' OR available='FALSE'),
	price FLOAT(10) NOT NULL,

	PRIMARY KEY(sid, flight_no, flight_time),
	FOREIGN KEY(flight_no, flight_time) 
		REFERENCES flight(fno, depart_time) ON DELETE CASCADE
);


CREATE TABLE reservation (
	book_ref CHAR(8) PRIMARY KEY,
	book_time TIMESTAMP,
	seat_id CHAR(3),
	flight_no CHAR(5),
	flight_time TIMESTAMP,
	passenger_id INTEGER REFERENCES passenger(pid) ON DELETE CASCADE,

	FOREIGN KEY (seat_id, flight_no, flight_time) 
		REFERENCES seat(sid, flight_no, flight_time) ON DELETE CASCADE
	
);