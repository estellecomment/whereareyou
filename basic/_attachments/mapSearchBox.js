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

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

function savePlace(){
  displayMessage('Submitting...');
  event.preventDefault();

  var name = getInputs('#newLocationForm').name;
  var place = selectedPlace;
  console.log('saving place', name, selectedPlace);  

  // Validate inputs.
  if (!name || name === "") {
    displayMessage('Enter a user name please.');
    return;
  }
  if (!selectedPlace || $.isEmptyObject(selectedPlace) ||
      !selectedPlace.geometry || !selectedPlace.geometry.location) {
    displayMessage('Select a place please.');
    return;    
  }
  var latLng = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
  console.log(latLng);
  submitLocation(name, latLng);
}