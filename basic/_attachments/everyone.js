var map;
var bounds;
var markers;
$(document).ready(function() {
  let getLatestLocations = function() {
    return db.query('basic/locations', { include_docs: true }).then(function (res) {
      let latestLocations = {};
      for (let row of res.rows) {
        if (!latestLocations[row.key] || row.doc.timestamp_millis > latestLocations[row.key].timestamp_millis) {
          latestLocations[row.key] = row.doc;
        }
      }
      return latestLocations;
    });
  };

  let getUsers = function() {
    return db.query('basic/users', { include_docs: true }).then(function (res) {
      return res.rows.map(function(row) { return row.doc; });
    });
  };

  // TODO use proper templates!
  // TODO require the utils file properly to get timestampToString.
  let fillUserLocationTemplate = function(user, location) {
    if (!location) {
      return '<li>' +
        '<p>' + user.name + ' has never been seen. Ever. Very mysterious.</p>' +
        '</li>';
    }
    return '<li>' +
        // add your XSS attack here
        '<p>' + user.name + ' was last seen</p>' +
        '<p>on ' + timestampToString(location.timestamp_millis) + '</p>' +
        // or here
        '<p>in ' + location.place.name + '</p>' +
        '<p>' + location.place.formatted_address + '</p>' +
        '</li>';
  };

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

  let addBounds = function(bounds, place){
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

  Promise.all([getUsers(), getLatestLocations()])
    .then(function(res) {
      let users = res[0];
      let latestLocations = res[1]
      console.log(users);
      console.log(latestLocations);

      var userList = $('#userlist');
      for (let user of users) {
        if (latestLocations[user._id]) {
          userList.append(fillUserLocationTemplate(user, latestLocations[user._id]));
          makeMarker(map, markers, latestLocations[user._id].place);
          addBounds(bounds, latestLocations[user._id].place);
        }
      }
      map.fitBounds(bounds);
    })    
    .catch(function(err) {
      console.error(err);
    });
});

function initMap() {
  var uluru = {
    lat: -25.363,
    lng: 131.044
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  bounds = new google.maps.LatLngBounds();
  markers = [];
}