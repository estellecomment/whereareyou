function submitLocation(username, selectedPlace) {
  function getUserId(name) {
    return db.query('basic/usersbyname', {
      key: name
    })
    .then(function(result) {
      console.log('got result : ' + JSON.stringify(result));
      if (typeof result === 'string' || result instanceof String) {
        result = JSON.parse(result);
      }
      var users = result.rows;
      if (users.length == 0) {
        console.log('Unknown user.');
        throw new Error("Unknown user.");
      }
      if (users.length > 1) {
        console.log('More then one user with name ' + users[0].key);
        throw new Error("Something went wrong, we found two copies of you... Sorry.");
      }
      var userId = users[0].id;
      console.log('got userId : ' + userId);
      return userId;
    });
  }

  function putLocation(userId, selectedPlace) {
    console.log('putlocation', userId, selectedPlace);
    var locationData = {};
    locationData.user = userId;
    locationData.type = 'location';
    locationData.place = selectedPlace;
    locationData.timestamp_millis = Math.floor(Date.now());

    return db.post(locationData);
  }

  console.log('saveLocation', username, selectedPlace);
  getUserId(username)
    .then(function(userId) {
      return putLocation(userId, selectedPlace);
    })
    .then(function(data) {
      console.log('put result ' + data);
      displayMessage('Location submitted! ' +
            'Check out <a href="everyone.html">where everyone is</a>.');
    }) 
    .catch(function(error) {
      displayMessage(error +
        '\nMaybe <a href="newUserForm.html">create a new user</a>?');
    });
}
