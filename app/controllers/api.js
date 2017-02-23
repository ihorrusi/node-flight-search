'use strict';
var express = require('express');
var router = express.Router();
var airline = require('../models').airline;
var airport = require('../models').airport;
var flight = require('../models').flight;

router.get('/airlines', function (req, res, next) {
  airline.getAll().then(function(data) {
    return res.json(data)
  }).catch(function(error){
    return res.json([])
  })
});

router.get('/airports', function (req, res, next) {
  var q = req.query.q;

  airport.getAllByQuery(q).then(function(data) {
    return res.json(data)
  }).catch(function(error){
    return res.json([])
  })
});

router.get('/search', function (req, res, next) {
  var date = req.query.date;
  var from = req.query.from;
  var to = req.query.to;

  flight.getAllByParams(date, from, to).then(function(data) {
    return res.json(data)
  }).catch(function(error){
    console.log('err', error)
    return res.json([])
  })
});

module.exports = function (app) {
  app.use('/api', router);
};
