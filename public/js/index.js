'use strict';

var $ = require('jquery');
var SearchFlightPage = require('./searchFlightPage');

$(function(){
  if($('#search-flight')){
    new SearchFlightPage()
  }
});
