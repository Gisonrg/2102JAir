var express = require('express');
var router = express.Router();

/* GET Admin control page. */
router.get('/', function(req, res) {
  res.render('admin', { title: 'J-Air Admin Dashboard' });
});
router.get('/airport', function(req, res) {
  res.render('admin-airport', { title: 'J-Air Admin | Manage Airport' });
});

router.get('/plane', function(req, res) {
  res.render('admin-plane', { title: 'J-Air Admin | Manage Plane' });
});

router.get('/user', function(req, res) {
  res.render('admin-user', { title: 'J-Air Admin | Manage User' });
});

router.get('/flight', function(req, res) {
  res.render('admin-flight', { title: 'J-Air Admin | Manage Flight' });
});

router.get('/booking', function(req, res) {
  res.render('admin-booking', { title: 'J-Air Admin | Manage Booking' });
});

module.exports = router;
