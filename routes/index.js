var express = require('express');
var router = express.Router();

/* Hämtar startsida- används inte i detta projekt */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
