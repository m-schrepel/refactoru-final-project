// Person class with relevant marker data and unique, possibly hilarious name
var people = [];
var Person = function (where, startTime, endTime) {
  this.where = where;
  this.startTime = startTime;
  this.endTime = endTime;
};
// Function that gets the start time and end time and returns a properly formatted time stamp
start = function () {
  var begin = $('.ui-rangeSlider-leftLabel').find('.ui-rangeSlider-label-value').html();
  return moment(begin, "h:mma")._d;
};
end = function() {
 var end = $('.ui-rangeSlider-rightLabel').find('.ui-rangeSlider-label-value').html();
 return moment(end, "h:mma")._d;
};
var circle = {};
function initialize(e) {
  $.get('/dbGet', function(doc, err){
    var userName = doc.profile.displayName;
    $('#notify-text').text('Welcome '+userName)
  });
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
    if (people<1) {
      var circle = new google.maps.Circle({
      map: map,
      fillColor: "#F56d18",
      center: myLatlng,
      radius: 800,
      fillOpacity: .60,
      clickable: true,
      strokeColor: '#FFF',
      strokeOpacity: 0,
      draggable: true
      });
      var person = new Person (myLatlng, start(), end());
      people.push(person);
      var data = {
        start: start(),
        end: end(),
        where: {
          lat: people[0].where.lat(),
          lng: people[0].where.lng()
        }
      }
      $.post('/dbsubmit', data, function(){
      });
      
      // Drag listener that updates locations and saves
      google.maps.event.addDomListener(circle, 'dragend', function(e){
        person.where = circle.getCenter();
        var data = {
          start: start(),
          end: end(),
          where: {
            lat: people[0].where.lat(),
            lng: people[0].where.lng()
          }
        }
        $.post('/dbsubmit', data, function(){
        });
      });
    }
    else {
      $('#error').slideToggle().delay(4500).slideToggle();
    }
  };
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

  google.maps.event.addDomListener(map, 'click', addPerson);
  google.maps.event.addDomListener(window, "resize", function(e) {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
  });
}
google.maps.event.addDomListener(window, 'load', initialize);