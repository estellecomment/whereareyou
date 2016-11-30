'use strict';

// TODO use proper packages.
var getMapUtils = function() {
  var bounds;
  var markers;
  var map;
  var selectedPlace;

  let _addBounds = function(place) {
    if (!place || !place.geometry) {
      return;
    }
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else if (place.geometry.location) {
      bounds.extend(place.geometry.location);
    }
  };

  let _clearMarkers = function() {
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
  };

  // TODO make an object and add these functions on it.
  let _clearBounds = function() {
    bounds = new google.maps.LatLngBounds();
  }

  let _makeMarker = function(place) {
    if (!place || !place.geometry || !place.geometry.location) {
      return;
    }
    var icon;
    if (place.icon) {
      icon = {
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
        url: place.icon
      };
    }
    markers.push(new google.maps.Marker({
      icon: icon,
      map: map,
      title: place.name,
      position: place.geometry.location
    }));
  };

  let addMarker = function(place) {
    _makeMarker(place);
    _addBounds(place);
    map.fitBounds(bounds);
  };

  let addSearchBox = function(searchBoxElementId) {
    selectedPlace = {};

    // Create the search box and link it to the UI element.
    var input = document.getElementById(searchBoxElementId);
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        selectedPlace = {};
        return;
      }
      if (places.length == 1) {
        selectedPlace = places[0];
        console.log('Selected place', selectedPlace);
      }

      _clearMarkers();
      _clearBounds();

      // For each place, get the icon, name and location.
      places.forEach(function(place) {
        _makeMarker(place);
        _addBounds(place);
      });
      map.fitBounds(bounds);
    });
  };

  let initMap = function(mapElementId) {
    var uluru = {
      lat: -25.363,
      lng: 131.044
    };
    map = new google.maps.Map(document.getElementById(mapElementId), {
      zoom: 4,
      center: uluru
    });
    bounds = new google.maps.LatLngBounds();
    markers = [];
  };

  let getSelectedPlace = function() {
    return selectedPlace;
  };

  return {
    addMarker: addMarker,
    addSearchBox: addSearchBox,
    getSelectedPlace: getSelectedPlace,
    initMap: initMap
  };
};
