'use strict';
var $ = require('jquery');
var moment = require('moment');
require('eonasdan-bootstrap-datetimepicker');
function SearchFlightPage(){
  var DATE_RANGE = 2;
  var $from = $('#from');
  var $to = $('#to');
  var $date = $('#date');
  var $form = $('#search-form');
  var $submitButton = $('#search-form button[type="submit"]');
  var dateFormat = 'YYYY-MM-DD';
  var request = null;
  var activeDate = null;
  var formParams = {};
  var flights = [];
  var dates = [];

  this.initPage = function(){
    $date.attr("placeholder", moment(new Date()).format(dateFormat));
    $date.datetimepicker({
      format: 'YYYY-MM-DD'
    });
    return this;
  }.bind(this);

  this.bindEvents = function(){
    $form.on('submit', onSubmit);
  }.bind(this);

  function cleanUpAllContent(){
    renderDates([]);
    renderContent([]);
  };

  function onSubmit (event){
    event.preventDefault();
    cleanUpAllContent();
    toggleSubmitDisable();
    formParams = getFormParams();
    activeDate = formParams.date;
    loadFlightsByDate(formParams, function(data){
      flights = data;
      toggleSubmitDisable();
      if(flights.length !== 0){
        dates = buildDateRange(activeDate);
        renderDates(dates);
      }
      renderContent(flights, true);
    });

  }

  function toggleSubmitDisable (){
    var disabled = $submitButton.attr('disabled');
    $submitButton.attr('disabled', !disabled)
  }

  function loadFlightsByDate(data, cb){
    showPreloader();
    if(request && typeof request.abort === 'function'){
      request.abort()
    }
    request = $.ajax({
      url: "api/search",
      type: "GET",
      data: data,
      success: function(response) {
        hidePreloader();
        cb(response);
      },
      error: function(err, status) {
        if(status !== 'abort'){
          hidePreloader();
          cb([]);
        }
      }
    });
  }

  function buildDateRange (activeDate){
    var dates = [moment(activeDate , dateFormat).format(dateFormat)];
    for(var i = 0; i < DATE_RANGE; i++){
      dates.unshift(moment(activeDate, dateFormat).add((i+1) * -1, 'days').format(dateFormat))
      dates.push(moment(activeDate, dateFormat).add((i+1), 'days').format(dateFormat))
    }
    return dates.map(function(date){
      return {
        value: date,
        isActive: date === activeDate
      }
    });
  }

  function changeDate(date){
    date = date.trim();
    if(activeDate === date){
      return;
    }
    renderContent([]);
    activeDate = date;
    dates.forEach(function(e){
      if(e.value === activeDate){
        e.isActive = true;
      }else{
        e.isActive = false
      }
    });
    formParams.date = activeDate;
    loadFlightsByDate(formParams, function(data){
      flights = data;
      renderContent(flights, true);
    });
    renderDates(dates);
  }

  function getFormParams(){
    return {
      from: $from.val(),
      to: $to.val(),
      date: $date.val()
    }
  }

  function renderDates(dates){
    var nodes = dates.map(function(date){
      var li = $('<li role="presentation"></li>');
      var a = ($([
          '<a href="#">',
          moment(date.value).format('YYYY-MM-DD'),
          '</a>'
        ].join('\n'))
      ).on('click', function(e){
        changeDate($(e.target).html())
      });
      li.append(a);
      li.addClass(date.isActive ? 'active' : '')
      return li;
    });
    $('#dates').html(nodes)
  }

  function renderContent(data, showNoData){
    var nodes = [];
    data.forEach(function(group){
      group.forEach(function(row){
        var node = $('<div class="panel panel-primary"></div>');
        var header = $('<div class="panel-heading"></div>').html(group[0].airline.name);
        var body = $('<div class="panel-body"></div>');

        var h5From = $('<h5></h5>').html('From');
        var countryFrom = $('<p></p>').html(row.start.cityName + ',' + row.start.countryName);
        var timeFrom = $('<h4></h4>').html('at: ' + moment(row.start.dateTime).format('h:mm a'));
        var airportFrom = $('<p></p>').html('airport: ' + row.start.airportName);
        var from = $('<div class="col-md-6"></div>').append([
          h5From,
          countryFrom,
          timeFrom,
          airportFrom
        ]);

        var h5To = $('<h5></h5>').html('To');
        var countryTo = $('<p></p>').html(row.finish.cityName + ',' + row.finish.countryName);
        var timeTo = $('<h4></h4>').html('at: ' + moment(row.finish.dateTime).format('h:mm a'));
        var airportTo = $('<p></p>').html('airport: ' + row.finish.airportName);
        var to = $('<div class="col-md-6"></div>').append([
          h5To,
          countryTo,
          timeTo,
          airportTo
        ]);

        var h5Details = $('<h5></h5>').html('Details');
        var planeDetails = $('<p></p>').html('plane: ' + row.plane.fullName);
        var distanceDetails = $('<p></p>').html('distance: ' + row.distance + ' kilometers');
        var priceDetails = $('<h4></h4>').html('price: $' + row.price);
        var details = $('<div class="col-md-12"></div>').append([
          h5Details,
          planeDetails,
          distanceDetails,
          priceDetails
        ]);

        node.append([
          header,
          body.append([from, to, details])
        ]);

        nodes.push(node)

      });
    });
    if(nodes.length === 0 && showNoData){
      nodes.push($('<h4 class="text-center">No info</h4>'))
    }
    $('#data').html(nodes);
  }

  function showPreloader(){
    $('#fountainG').show();
  }

  function hidePreloader(){
    $('#fountainG').hide();
  }

  this.initPage().bindEvents();
}

module.exports = SearchFlightPage;
