'use strict';

var flightAPIConfig = require('../../config/flightAPIconfig');
var flightAPI = require('../services/flightAPIService')(flightAPIConfig);

module.exports = {
  airline: require('./airline')(flightAPI),
  airport: require('./airport')(flightAPI),
  flight: require('./flight')(flightAPI)
};
