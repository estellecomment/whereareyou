var mapUtils = getMapUtils();

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

  // TODO require the utils file properly to get timestampToString.
  let fillUserLocationTemplate = function(user, location) {
    var neverSeen = '<li> \
      <p>{{username}} has never been seen. Ever. Very mysterious.</p> \
      </li>';
    var seen = '<li>\
      <p>{{username}} was last seen</p>\
      <p>on {{date}}</p> \
      <p>in {{place}}</p> \
      <p>{{address}}</p>';

    var Mustache = require('mustache');

    if (!location) {
      return Mustache.render(neverSeen, { username: user.name });
    }
    return Mustache.render(seen, { 
      username: user.name,
      date: timestampToString(location.timestamp_millis),
      place: location.place.name,
      address: location.place.formatted_address
    });
  };

  Promise.all([getUsers(), getLatestLocations()])
    .then(function(res) {
      let users = res[0];
      let latestLocations = res[1]
      console.log(users);
      console.log(latestLocations);

      var userList = $('#userlist');
      for (let user of users) {
        userList.append(fillUserLocationTemplate(user, latestLocations[user._id]));
        if (latestLocations[user._id]) {
          mapUtils.addMarker(latestLocations[user._id].place);
        }
      }
    })    
    .catch(function(err) {
      console.error(err);
    });
});

function initMap() {
  mapUtils.initMap('map');
}