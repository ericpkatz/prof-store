function MapHelper(id){
  this.id = id;
  this.markers = [];
  this.init();
}

MapHelper.prototype.setMarkers = function(addresses){
  this.markers.forEach(function(marker){
    marker.setMap(null);
  });

  this.markers = addresses.map(function(address){
    var location = address.geometry.location;
    var latlng = new google.maps.LatLng(location.lat, location.lng);
    return new google.maps.Marker({
        position: latlng,
        title: address.formatted_address
    });
  });
  this.setDefaultMarker();

  var that = this;
  var bounds = new google.maps.LatLngBounds();
  this.markers.forEach(function(marker){
    bounds.extend(marker.position);
    marker.setMap(that.map);
  });

  if(this.markers.length){
    this.map.fitBounds(bounds);
  }
};

MapHelper.prototype.setDefaultMarker = function(){
  var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
  var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Hello World!"
  });
  // Add the marker to the map by calling setMap()
  marker.setMap(this.map);
  this.markers.push(marker);
}

MapHelper.prototype.init = function(){
  var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
  // set the map options hash
  var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById(this.id);
  // initialize a new Google Map with the options
  this.map = new google.maps.Map(map_canvas_obj, mapOptions);
  this.setDefaultMarker();
}

export default MapHelper;
