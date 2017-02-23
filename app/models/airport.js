'use strict';

module.exports = function(flightAPI){
  return {
    getAllByQuery: function(query){
      if(!query){
        return Promise.resolve([]);
      }
      return flightAPI.getAirports(query);
    }
  }
};
