var express = require('express'),
  router = express.Router(),
  airline = require('../models').airline,
  airport = require('../models').airport,
  flight = require('../models').flight;

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Flight search'
    });
});
