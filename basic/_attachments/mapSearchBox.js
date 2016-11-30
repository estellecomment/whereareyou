var mapUtils = getMapUtils();

function initMapSearchBox() {
  mapUtils.initMap('map');
  mapUtils.addSearchBox('map-search-box');
}

function savePlace() {
  displayMessage('Submitting...');
  event.preventDefault();

  let getValidInputs = function() {
    var name = getInputs('#newLocationForm').name;
    var place = mapUtils.getSelectedPlace();
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
    return saveablePlace;
  };

  var savedPlace = makeSaveablePlace(inputs.place);
  console.log(savedPlace);
  submitLocation(inputs.name, savedPlace);
}