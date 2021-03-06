var currentCircles = [];
var drawArray = [];
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
  $.get('/dbGet', function(doc, err){
    $('#notify-text').text('Welcome '+ doc.form['food-truck-name'])
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
  google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
  });
  $("#slider-el").bind("userValuesChanged", function(e, data){
    $.get('/dbDraw', function(doc, err){
      var data = doc;
      drawArray = data.filter(function (item) {
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
          fillColor: "#F56D18",
          center: new google.maps.LatLng(drawArray[i].where.A,drawArray[i].where.k),
          radius: 800,
          fillOpacity: .05,
          clickable: false,
          strokeColor: '#FFF',
          strokeOpacity: .75
        })
        currentCircles.push(circles);
      };
    });
  });
};
google.maps.event.addDomListener(window, 'load', initialize);