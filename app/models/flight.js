'use strict';
var moment = require('moment');

module.exports = function(flightAPI){
  return {
    getAllByParams: function(date, from, to){

      if(!date){
        return Promise.reject('the date param should be');
      }

      if(!moment(date , "YYYY-MM-DD").isValid()){
        return Promise.reject('the date param should be in YYYY-MM-DD format');
      }

      if(!from){
        return Promise.reject('the from param should be');
      }

      if(!to){
        return Promise.reject('the to param should be');
      }

      function mapAirports(result){
        var froms = result[0];
        var tos = result[1];

        function mapper(entity){
          return entity['airportCode'];
        }

        var tosAsCodes = tos.map(mapper);
        var fromASCodes = froms.map(mapper)
        return {
          from: fromASCodes,
          to: tosAsCodes
        }
      }

      function mapAirlines(result){
        function mapper(entity){
          return entity['code'];
        }
        return result.map(mapper);
      }

      var airports = Promise.all([
        flightAPI.getAirports(from),
        flightAPI.getAirports(to)
      ]).then(mapAirports);

      var airlines = flightAPI.getAirlines().then(mapAirlines);

      return Promise.all([airports, airlines]).then(function(r){
        var airports = r[0];
        var airlineCodes = r[1];
        var promises = [];
        airlineCodes.forEach(function(airlineCode){
          airports.from.forEach(function(from){
            airports.to.forEach(function(to){
              promises.push(flightAPI.flightSearch(airlineCode, date, from, to))
            })
          })
        });

        return Promise.all(promises);
      })
    }
  }
};
