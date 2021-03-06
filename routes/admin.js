var express = require('express');
var router = express.Router();
var Admin = require('../model/admin.js');
var User = require('../model/user.js');
var crypto = require('crypto');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var Airport = require('../model/airport.js');
var Plane = require('../model/plane.js');
var Flight = require('../model/flight.js');
var Seat = require('../model/seat.js');
var Booking = require('../model/booking.js');
// set up passport strategy
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  Admin.get(username, function(err, data) {
    var user = data[0];
    done(null, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    var md5 = crypto.createHash('md5'),
      password = md5.update(password).digest('hex');
    console.log(password);
    Admin.get(username, function(err, data) {

      if (err) {
        return done(err);
      }

      if (data.length == 0) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      } else {
        var user = data[0];
        if (user.password != password) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        } else {
          return done(null, user);
        }
      }

    });
  }
));

/* GET Admin login page. */
router.get('/login', checkNotLogin); // make sure not login
router.get('/login', function(req, res) {
  res.render('admin-login', {
    title: 'J-Air Admin Login',
    username: req.session.passport.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

/* POST Admin login request */
router.post('/login', checkNotLogin);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin/',
  failureRedirect: '/admin/login',
  failureFlash: true
}));

router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/admin/login');
});

/* GET Admin control page. */
router.get('/', checkLogin);
router.get('/', function(req, res) {
  res.render('admin', {
    title: 'J-Air Admin Dashboard',
    username: req.session.passport.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.get('/airport', checkLogin);
router.get('/airport', function(req, res) {
  res.render('admin-airport', {
    title: 'J-Air Admin | Manage Airport',
    username: req.session.passport.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.get('/plane', checkLogin);
router.get('/plane', function(req, res) {
  res.render('admin-plane', {
    title: 'J-Air Admin | Manage Plane',
    username: req.session.passport.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.get('/user', checkLogin);
router.get('/user', function(req, res) {
  User.getAll(function(err, users) {
    res.render('admin-user', {
      title: 'J-Air Admin | Manage User',
      username: req.session.passport.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      users: users
    });
  });
});

router.get('/flight', checkLogin);
router.get('/flight', function(req, res) {
  Airport.getAll(function(err, airports) {
    Plane.getAvaliable(function(err, planes) {
      Plane.getAll(function(err, allPlanes) {
        Flight.getAll(function(err, flights) {
          res.render('admin-flight', {
            title: 'J-Air Admin | Manage Flight',
            username: req.session.passport.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            airports: airports,
            planes: planes,
            allPlanes:allPlanes,
            flights: flights
          })
        })
      })
    })
  });
});

router.get('/seat', checkLogin);
router.get('/seat', function(req, res) {
  Flight.getAll(function(err, flights) {
    res.render('admin-seat', {
      title: 'J-Air Admin | Manage Seats',
      username: req.session.passport.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      flights: flights
    })
  });
});


router.get('/booking', checkLogin);
router.get('/booking', function(req, res) {
  Booking.getAll(function(err, bookings) {
    res.render('admin-booking', {
      title: 'J-Air Admin | Manage Booking',
      username: req.session.passport.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      bookings: bookings
    });
  });
});

function checkLogin(req, res, next) {
  if (!req.session.passport.user) {
    req.flash('error', 'Please login first');
    res.redirect('/admin/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.passport.user) {
    req.flash('error', 'You have already logged in');
    res.redirect('back');
  }
  next();
}

module.exports = router;