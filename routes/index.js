var express = require('express');
var router = express.Router();
var User = require('../model/user.js');
var Seat = require('../model/seat.js');
var Booking = require('../model/booking.js');

var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { 
  	title: 'J-Air | Home',
  	user : req.session.user,
    flight : req.session.flight,
    returnFlight : req.session.returnFlight,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});


/* GET search page. */
router.get('/search', function(req, res) {
  res.render('search', { 
  	title: 'J-Air | Search',
  	user : req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});


/* GET selectFlights page. */
router.get('/result', function(req, res) {
  res.render('result', { 
    title: 'J-Air | Select Flights',
    user : req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
    numbers:{"haha":2}
  });
});

router.post('/result', checkLogin);
router.post('/result', function(req, res) {
  req.session.price = 0;
  if (req.body.depart[0].fno) {
    req.session.depart = req.body.depart[0];
    req.session.depart.seatClass = req.body.class;
    req.session.price += req.session.depart.price * req.session.depart.passengers;
  }
  if (req.body.return[0].fno) {
    req.session.return = req.body.return[0];
    req.session.return.seatClass = req.body.class;
    req.session.price += req.session.return.price * req.session.return.passengers;
  }
  console.log(req.session.price);
  res.send("success");
});

/* GET selectSeats page. */
router.get('/checkout', checkLogin);
router.get('/checkout', function(req, res) {
  var seatClass = req.session.depart.seatClass;
  console.log("session:" + seatClass);
  var seats = [];
  Seat.getBookingSeat({
      "fno": req.session.depart.fno,
      "flight_time": req.session.depart.flight_time,
      "seatClass": seatClass
    }, function(err, data) {
      seats.push(data);
      // check if there is any return flight
      if (req.session.return) {
        Seat.getBookingSeat({
            "fno": req.session.depart.fno,
            "flight_time": req.session.depart.flight_time,
            "seatClass": seatClass
          }, function(err, data) {
              seats.push(data);
              res.render('checkOut', { 
                  title: 'J-Air | Check Out Now',
                  user : req.session.user,
                  success: req.flash('success').toString(),
                  error: req.flash('error').toString(),
                  depart_flight: req.session.depart,
                  return_flight: req.session.return,
                  seats: seats
              });
        })
      } else {
        res.render('checkOut', { 
            title: 'J-Air | Check Out Now',
            user : req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            depart_flight: req.session.depart,
            return_flight: req.session.return,
            seats: seats
        });
      }
  });
});

router.post('/checkout', checkLogin);
router.post('/checkout', function(req, res) {
  // send session from checkOut here.
  var data = req.body.passengers;
  var passengers = JSON.parse(data);
  for (var i = 0; i < passengers.length; i++) {
    var passenger = passengers[i];
    User.get(passenger.email, function(error, data) {
      if (data.length != 0) {
        console.log(JSON.stringify(passenger));
        var user = data[0];
        // user already exists, just insert
        var bookRef = Booking.generateREF();
        var seat = passenger.singleSeat;
        var fno = req.session.depart.fno;
        var flight_time = req.session.depart.flight_time;
        var pid = user.pid;
        var booking = new Booking(bookRef, seat, fno, flight_time, pid);
        booking.add(function(err) {
          if (err) {
            console.log("error");
          }
        });
        if (passenger.returnSeat) {
          var bookRef = Booking.generateREF();
          var seat = passenger.returnSeat;
          var fno = req.session.return.fno;
          var flight_time = req.session.return.flight_time;
          var pid = user.pid;
          // return ticket
          var booking = new Booking(bookRef, seat, fno, flight_time, pid);
          booking.add(function(err) {
            if (err) {
              console.log("error");
            }
          });
        }
      } else {
        console.log("Creating first: "+JSON.stringify(passenger));
        // new user, create a user first
        var md5 = crypto.createHash('md5');
        var password = md5.update(passenger.passport).digest('hex');
        var newUser = new User(passenger.name, passenger.passport, passenger.email, password, passenger.contact);
        newUser.add(function(err, user) {
          if (err) {
            console.log(err);
          }
        });

        // after adding this user, treat it as the previous case.
        User.get(passenger.email, function(error, data) {
          var user = data[0];
          // user already exists, just insert
          var bookRef = Booking.generateREF();
          var seat = passenger.singleSeat;
          var fno = req.session.depart.fno;
          var flight_time = req.session.depart.flight_time;
          var pid = user.pid;
          var booking = new Booking(bookRef, seat, fno, flight_time, pid);
          booking.add(function(err) {
            if (err) {
              console.log("error");
            }
          });
          if (passenger.returnSeat) {
            var bookRef = Booking.generateREF();
            var seat = passenger.returnSeat;
            var fno = req.session.return.fno;
            var flight_time = req.session.return.flight_time;
            var pid = user.pid;
            // return ticket
            var booking = new Booking(bookRef, seat, fno, flight_time, pid);
            booking.add(function(err) {
              if (err) {
                console.log("error");
              }

            });
          }
        });
      }
    });
  }
  res.json({
    "success": "ok"
  });
});

/* GET paysuccess page. */
router.get('/paysuccess', checkLogin);
router.get('/paysuccess', function(req, res) {
  res.render('paysuccess', {
    title: 'J-Air | Pay Success',
    user : req.session.user,
    depart_flight: req.session.depart,
    return_flight: req.session.return,
    totalPrice : req.session.price,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});


/* GET login page. */
router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'J-Air | Login',
    user : req.session.user,
    flight : req.session.flight,
    returnFlight : req.session.returnFlight,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

/* POST User login request */
router.post('/login', checkNotLogin);
router.post('/login', function(req, res){
  var email = req.body.email,
  password = req.body.password;
  if(email == "" || password == ""){ // incomplete information
    req.flash('error', 'Please complete the login information');
    res.redirect('/login');
  } else{
    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    User.get(email, function (err, user){

    if(user.length!=0){ // user found
      user = user[0];
      if(user.password != password){ // wrong password
        req.flash('error', 'Wrong Password');
        res.redirect('/login');
      } else{ // login successfully
        req.session.user = user;
        req.flash('success','Login Successfully');
        res.redirect('/');
      }
    }else{ // no such user
      req.flash('error', 'Wrong Email');
      res.redirect('/login');
    }
  })
  }
});

router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
  req.session.user = null;
  res.redirect('/');
});

/* GET register page. */
router.get('/', checkNotLogin);
router.get('/register', function(req, res) {
  res.render('register', {
    title: 'J-Air | Register',
    user : req.session.user,
    flight : req.session.flight,
    returnFlight : req.session.returnFlight,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

/* POST user registration. */
router.post('/register', function(req, res) {
	var md5 = crypto.createHash('md5');
	var name = req.body.name,
  email = req.body.email,
  password = md5.update(req.body.password).digest('hex'),
  contact = req.body.contact,
  passport = req.body.passport;

  var newUser = new User(name, passport, email, password, contact);
  User.get(newUser.email, function (err, user) {
    console.log(user);
    if (user.length!=0) {
      req.flash('error', 'User already exists!');
      return res.redirect('/register');
    }
    newUser.add(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/register');
      }
      req.session.user = newUser;
      // where should we display this success message?
      req.flash('success', 'registered successfully!');
      res.redirect('/');
    });
  });
});

/* GET profile page. */
router.get('/profile', checkLogin);
router.get('/profile', function(req, res) {
  User.get(req.session.user.email, function(err, user) {
    var user = user[0];
    res.render('profile', {
      title: 'J-Air | My Profile',
      user : user,
      flight : req.session.flight,
      returnFlight : req.session.returnFlight,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


/* POST user update information. */
router.post('/profile', checkLogin);
router.post('/profile', function(req, res) {
  var title = req.body.title,
  name = req.body.name,
  contact = req.body.contact,
  passport = req.body.passport,
  passportExpDate = req.body.passportExpDate,
  dateOfBirth = req.body.dateOfBirth,
  address = req.body.address,
  email = req.session.user.email;

  User.update(email, title, name, contact, passport, passportExpDate, dateOfBirth, address, function (err, user){
    if (err) {
      req.flash('error', err);
      return res.redirect('/profile');
    } else {
      req.flash('success', 'update successfully!');
      res.redirect('/profile');
    }
  });
});

router.get('/booking', checkLogin);
router.get('/booking', function(req, res) {
  Booking.manage(req.session.user.email, function(err, bookings) {
    res.render('booking', { 
      title: 'J-Air | Booking',
      user : req.session.user,
      flight : req.session.flight,
      returnFlight : req.session.returnFlight,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      bookings: bookings
    });
  });
});



function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please login first');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'You have already logged in');
    return res.redirect('back');
  }
  next();
}

module.exports = router;
