var express = require('express');
var router = express.Router();
var User = require('../model/user.js');
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { 
  	title: 'J-Air | Home',
  	user : req.session.user
  });
});

/* GET search page. */
router.get('/search', function(req, res) {
  res.render('search', { 
  	title: 'J-Air | Search',
  	user : req.session.user
  });
});

/* GET login page. */
router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
  res.render('login', { 
  	title: 'J-Air | Login',
  	user : req.session.user
  });
});

/* GET register page. */
router.get('/register', function(req, res) {
  res.render('register', { title: 'J-Air | Register',user : req.session.user });
});

router.post('/register', function(req, res) {
	var md5 = crypto.createHash('md5');
	var name = req.body.name,
		email = req.body.email,
      	password = md5.update(req.body.password).digest('hex'),
       	contact = req.body.contact,
      	passport = req.body.passport;

  var newUser = new User(name, password, email, passport, contact);
  User.get(newUser.email, function (err, user) {
    if (user.length!=0) {
      req.flash('error', 'User is existing!');
      return res.redirect('/register');//返回注册页
    }
    newUser.add(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/register');//注册失败返回主册页
      }
      req.session.user = user;//用户信息存入 session
      req.flash('success', 'registered successfully!');
      res.redirect('/');//注册成功后返回主页
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
