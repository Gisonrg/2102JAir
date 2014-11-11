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


/* GET selectSeats page. */
router.get('/selectSeats', checkLogin);
router.get('/selectSeats', function(req, res) {
  res.render('selectSeats', { 
    title: 'J-Air | Seat Selection',
    user : req.session.user,
    flight : req.session.flight,
    returnFlight : req.session.returnFlight,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

/* GET paysuccess page. */
router.get('/paysuccess', checkLogin);
router.get('/paysuccess', function(req, res) {
  res.render('paysuccess', {
    title: 'J-Air | Pay Success',
    user : req.session.user,
    flight : req.session.flight,
    returnFlight : req.session.returnFlight,
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

/* GET search page. */
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
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'You have already logged in');
    res.redirect('back');
  }
  next();
}

module.exports = router;
