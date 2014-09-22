var express = require('express');
var router = express.Router();

/* GET a list of users */
router.get('/users', function(req, res) {
  res.send('getting all users');
});

/* POST create a new user */
router.post('/users', function(req, res) {
  res.send('create a new user');
});

/* GET a user */
router.get('/users/:id', function(req, res) {
  res.send('getting a user whose id is '+req.params.id);
});



router.get('/flights', function(req, res) {
  res.send('getting all flights');
});

router.get('/flights/:id', function(req, res) {
  res.send('getting a flight information');
});

module.exports = router;