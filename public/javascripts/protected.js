var currentCircles = [];
var drawArray = [];
var truckArray = [];
var notifyArray = [];
// Person class with relevant marker data and unique, possibly hilarious name
var people = [];
var Person = function (where, startTime, endTime, randName) {
  this.where = where;
  this.startTime = startTime;
  this.endTime = endTime;
  this.randName = randName;
};
var Foodtruck = function (where, truckName) {
  this.truckName = truckName;
  this.where = where;
}
var Notify = function (randName, truckName) {
  this.randName = randName;
  this.truckName = truckName;
}
// Function that gets the start time and end time and returns a properly formatted time stamp
start = function () {
  var begin = $('.ui-rangeSlider-leftLabel').find('.ui-rangeSlider-label-value').html();
  return moment(begin, "h:mma")._d;
};
end = function() {
 var end = $('.ui-rangeSlider-rightLabel').find('.ui-rangeSlider-label-value').html();
 return moment(end, "h:mma")._d;
};
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.77, -122.42),
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false,
    styles:
  [ 
    {     featureType: "poi", 
          elementType: "labels", 
          stylers: 
      [ 
        { visibility: "off" } 
      ] 
    } 
  ]
}; 
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    var addPerson = function(e) {
      var myLatlng = e.latLng;
      new google.maps.Circle({
        map: map,
        fillColor: "#F00",
        center: myLatlng,
        radius: 800,
        fillOpacity: .05,
        clickable: false,
        strokeColor: '#FFF',
        strokeOpacity: 0
      });
      var person = new Person (myLatlng, start(), end(), chance.name());
      people.push(person);
    };
    var image = {
      url: '/images/truck.png',
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(20, 20)
    };
    var addTruck = function(e) {
      var myLatlng = e.latLng;
      new google.maps.Marker({
        map: map,
        icon: image,
        draggable: true,
        position: myLatlng
      });
      var trucks = new Foodtruck (myLatlng, chance.last());
      truckArray.push(trucks)
    };
// This function compares foodtruck to users and notifies if < 1000 meters and messes with notify
    var truckDistanceCheck = function() {      
      for (var i = 0; i < people.length; i++) {
        var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(truckArray[0].where, people[i].where);
        if (distanceBetween < 1000) {
          var notifyLoop = new Notify (people[i].randName, truckArray[0].truckName);
          notifyArray.push(notifyLoop);
          $('#notify-list').prepend('<li>'+people[i].randName+","+" the "+truckArray[0].truckName+" is nearby"+'</li>')
          $('#notify-window').fadeIn(3000);
        }
        else {
          console.log("sorry");
        }
      }
    $('title').text(notifyArray.length + " notifications");
    $("#notify-label").text(notifyArray.length);
    $("#notify-label").addClass('active');
    truckArray.splice(0,1);
    };
// Reset the notify field and pop up a div with the notify information
    var notifyReset = function () {
      $('#notify-label').removeClass("active");
      $('#notify-label').text(0);
      $('title').text("Google Maps Demo");
      $('#notify-window').hide().children().empty();
      notifyArray = [];
    }
  //Slider init with current hour to 4 hours from now
    $("#slider-el").rangeSlider({
      bounds: {
        min: 0,
        max: 240
      },
      arrows: true,
      defaultValues: {
        min: 30,
        max: 75
      },
      range: {
        min: 45},
      step: 15,
  //This adjusts the display of the tooltip values
      formatter: function(val) {
       if (val===0) {
        return moment().format("h:mma");
       }
       else {
        return moment().add('minutes', val).format("h:mma")
       }
      }
    });
// event listeners
  $("#notify-label").click(notifyReset);
  google.maps.event.addDomListener(map, 'rightclick', addTruck);
  google.maps.event.addDomListener(map, 'rightclick', truckDistanceCheck);
  google.maps.event.addDomListener(map, 'click', addPerson);
  google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
  });
  $("#slider-el").bind("userValuesChanged", function(e, data){
    drawArray = dummyData.filter(function (item) {
      var rangeBegin = start();
      var rangeEnd = end();
      var timeBegin = item.startTime;
      var timeEnd = item.endTime;
      if (moment(timeEnd).isAfter(rangeBegin) && moment(timeBegin).isBefore(rangeEnd))
        return true;
    });
    for (var i = 0; i < currentCircles.length; i++) {
      currentCircles[i].setMap(null);
    };
      currentCircles = [];
    for (var i = 0; i < drawArray.length; i++) {
      var myLatlng = drawArray[i].where;
      var circles = new google.maps.Circle ({
        map: map,
        fillColor: "#F00",
        center: new google.maps.LatLng(drawArray[i].where.d,drawArray[i].where.e),
        radius: 800,
        fillOpacity: .05,
        clickable: false,
        strokeColor: '#FFF',
        strokeOpacity: 0
      })
      currentCircles.push(circles);
    };
  });
}
google.maps.event.addDomListener(window, 'load', initialize);