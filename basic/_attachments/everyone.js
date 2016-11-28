$(document).ready(function() {
  let getLatestLocations = function() {
    return db.query('basic/locations', { include_docs: true }).then(function (res) {
      let latestLocations = {};
      for (let row of res.rows) {
        if (!latestLocations[row.key] || row.doc.timestamp_sec > latestLocations[row.key].timestamp_sec) {
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
  let fillUserTemplate = function(user, location) {
    return '<li>' +
        // add your XSS attack here
        '<p>' + user.firstname + ' ' + user.lastname + ' was last seen</p>' +
        '<p>on ' + timestampToString(location.timestamp_sec) + '</p>' +
        // or here
        '<p>in ' + location.placename + '</p>' +
        '</li>';
  };

  Promise.all([getUsers(), getLatestLocations()])
    .then(function(res) {
      let users = res[0];
      let latestLocations = res[1]
      console.log(users);
      console.log(latestLocations);

      var userList = $('#userlist');
      for (let user of users) {
        userlist.append(fillUserTemplate(user, latestLocations[user._id]));
      }
    })    
    .catch(function(err) {
      console.error(err);
    });
});