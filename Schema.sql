DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS seat;
DROP TABLE IF EXISTS flight;
DROP TABLE IF EXISTS airport;
DROP TABLE IF EXISTS airplane;
DROP TABLE IF EXISTS administrator;
DROP TABLE IF EXISTS passenger;

CREATE TABLE passenger (
	pid INTEGER PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(128),
	name VARCHAR(128) NOT NULL,
	passport VARCHAR(9) NOT NULL,
	email VARCHAR(128) NOT NULL UNIQUE,
	password VARCHAR(40),
	contact VARCHAR(32),
	dateOfBirth VARCHAR(40),
	passportExpDate VARCHAR(40),
	address VARCHAR(256)
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
	fno CHAR(5) NOT NULL PRIMARY KEY, 
	depart_time TIME NOT NULL,
	arrive_time TIME NOT NULL,
	duration INTEGER NOT NULL,
	origin CHAR(3) REFERENCES airport(code) ON DELETE CASCADE,
	destination CHAR(3) REFERENCES airport(code) ON DELETE CASCADE,
	plane_id CHAR(6) REFERENCES airplane(aid) ON DELETE CASCADE

);

CREATE TABLE seat (
	sid CHAR(3) NOT NULL,
	flight_no CHAR(5), 
	flight_time DATE,
	-- For flight_time, it is which date the flight is departed.
	-- If we want to retrieve the depart time, use flight_no to search flight.
	seat_class VARCHAR(10) 
		CHECK(seat_class='First' OR seat_class='Business' OR seat_class='Economy'),
	available VARCHAR(6) CHECK(available = 'TRUE' OR available='FALSE'),
	price FLOAT(10) NOT NULL,

	PRIMARY KEY(sid, flight_no, flight_time),
	FOREIGN KEY(flight_no) 
		REFERENCES flight(fno) ON DELETE CASCADE
);


CREATE TABLE reservation (
	book_ref CHAR(8) PRIMARY KEY,
	book_time TIMESTAMP,
	seat_id CHAR(3),
	flight_no CHAR(5),
	flight_time DATE,
	passenger_id INTEGER REFERENCES passenger(pid) ON DELETE CASCADE,

	FOREIGN KEY (seat_id, flight_no, flight_time) 
		REFERENCES seat(sid, flight_no, flight_time) ON DELETE CASCADE
	
);