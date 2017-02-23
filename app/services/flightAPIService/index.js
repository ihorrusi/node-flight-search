'use strict';

var request = require('request');

function FlightAPIService(options){
  if (!(this instanceof FlightAPIService)) {
    return new FlightAPIService(options);
  }

  this.setConfig(options)
}

FlightAPIService.prototype = {
  setConfig: function(config){
    if(config) {
      this.config = config;
    }
  },
  getAirlines: function(){
    return new Promise(function(resolve, reject){
      var requestParams = {
        method: 'GET',
        url: this.config.airlinesEndpoint
      };
      request(this.config.airlinesEndpoint, function(error, response, body){
        if(error || response.statusCode !== 200){
          reject(error)
        }else{
          try{
            resolve(JSON.parse(body));
          }catch(e){
            reject(e)
          }
        }
      })
    }.bind(this))
  },
  getAirports: function(term){
    return new Promise(function(resolve, reject){
      var requestParams = {
        method: 'GET',
        url: this.config.airportsEndpoint,
        qs: {
          q: term
        }
      };
      request(requestParams, function(error, response, body){
        if(error || response.statusCode !== 200){
          reject(error)
        }else{
          try{
            resolve(JSON.parse(body));
          }catch(e){
            reject(e)
          }
        }
      })
    }.bind(this))
  },
  flightSearch: function(airlineCode, date, from, to) {
    return new Promise(function (resolve, reject) {
      var requestParams = {
        method: 'GET',
        url: [this.config.flightSearchEndpoint, airlineCode].join(''),
        qs: {
          date: date,
          from: from,
          to: to
        }
      };
      request(requestParams, function (error, response, body) {
        if(error || response.statusCode !== 200){
          reject(error)
        } else {
          try{
            resolve(JSON.parse(body));
          }catch(e){
            reject(e)
          }
        }
      })
    }.bind(this))
  }
};

module.exports = FlightAPIService;


