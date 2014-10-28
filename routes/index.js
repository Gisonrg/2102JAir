var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'J-Air | Home' });
});

/* GET search page. */
router.get('/search', function(req, res) {
  res.render('search', { title: 'J-Air | Search' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'J-Air | Login' });
});

/* GET register page. */
router.get('/register', function(req, res) {
  res.render('register', { title: 'J-Air | Register' });
});

/* GET Admin control page. */
router.get('/admin-dashboard', function(req, res) {
  res.render('admin', { title: 'J-Air Admin' });
});

/* GET Admin control page. */
router.get('/admin-dashboard', function(req, res) {
  res.render('admin', { title: 'J-Air Admin' });
});

/* GET Admin control page. */
router.get('/admin-dashboard', function(req, res) {
  res.render('admin', { title: 'J-Air Admin' });
});

/* GET Admin control page. */
router.get('/admin-dashboard', function(req, res) {
  res.render('admin', { title: 'J-Air Admin' });
});

module.exports = router;
