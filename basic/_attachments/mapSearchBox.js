// Export selectedPlace var.
var selectedPlace = {};

function initMapSearchBox() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -33.8688,
      lng: 151.2195
    },
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('map-search-box');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  let makeMarker = function(map, markers, place) {
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

  let addBounds = function(bounds, place) {
    if (!place || !place.geometry) {
      return;
    }
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else if (place.geometry.location) {
      bounds.extend(place.geometry.location);
    }
  }

  let clearMarkers = function() {
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
  };

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

    clearMarkers();

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      makeMarker(map, markers, place);
      addBounds(bounds, place);
    });
    map.fitBounds(bounds);
  });
}

function savePlace() {
  displayMessage('Submitting...');
  event.preventDefault();

  let getValidInputs = function() {
    var name = getInputs('#newLocationForm').name;
    var place = selectedPlace;
    console.log('saving place', name, place);

    // Validate inputs.
    if (!name || name === "") {
      displayMessage('Enter a user name please.');
      return;
    }
    if (!place || $.isEmptyObject(place) ||
      !place.geometry || !place.geometry.location ||
      !place.name ||
      !place.formatted_address) {
      displayMessage('Select a place please.');
      return;
    }
    return {
      name: name,
      place: place
    };
  };

  var inputs = getValidInputs();
  if (!inputs) {
    return;
  };

  let makeSaveablePlace = function(place) {
    var saveablePlace = {
      geometry: {
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      },
      name: place.name,
      formatted_address: place.formatted_address,
    };
    if (place.geometry.viewport) {
      saveablePlace.geometry.viewport = {
        east: place.geometry.viewport.b.f,
        north: place.geometry.viewport.f.b,
        west: place.geometry.viewport.b.b,
        south: place.geometry.viewport.f.f
      };
    }
    return savedPlace;
  };

  var savedPlace = makeSaveablePlace(inputs.place);
  console.log(savedPlace);
  submitLocation(inputs.name, savedPlace);
}