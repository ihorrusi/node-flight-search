'use strict';

module.exports = function(flightAPI){
  return {
    getAll: function(){
      return flightAPI.getAirlines();
    }
  }
};
