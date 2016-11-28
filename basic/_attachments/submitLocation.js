$(document).ready(function() {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function displayMessage(messageString) {
    $('#messages').html(messageString);
  }

  function queryDbForUser(name) {
    return db.query('basic/usersbyname', {
      key: name
    });
  }

  function getUserIdFromQueryResult(result) {
    var dfd = jQuery.Deferred();
    console.log('got result : ' + JSON.stringify(result));
    if (typeof result === 'string' || result instanceof String) {
      result = JSON.parse(result);
    }
    var users = result.rows;
    if (users.length == 0) {
      console.log('Unknown user.');
      return dfd.reject("Unknown user.");
    }
    if (users.length > 1) {
      console.log('More then one user with name ' + users[0].key);
      return dfd.reject("Something went wrong, we found two copies of you... Sorry.");
    }
    var userId = users[0].id;
    console.log('got userId : ' + userId);
    return dfd.resolve(userId);
  }

  function getUuid() {
    console.log('getUuid');
    // Get a UUID from CouchDB
    return $.get('../../../_uuids')
      .then(function(data) {
        console.log('got uuid : ' + data);
        var uuid = JSON.parse(data).uuids[0];
        return jQuery.Deferred().resolve(uuid);
      }, function(err) {
        console.log('Couldnt get uuid. ' + JSON.stringify(err));
        return jQuery.Deferred().reject('Error while saving.');
      });
  }

  function putLocation(userId, country, placename) {
    console.log('putlocation with userId ' + userId);
    var locationData = {};
    locationData.user = userId;
    locationData.type = "location";
    locationData.country = country;
    locationData.placename = placename;
    locationData.timestamp_sec = Math.floor(Date.now() / 1000); // in millis would have been better...

    return put(locationData)
      .then(function(data) {
        return data; // resolve? TODO
      }, function(err) {
        console.log('PUT error : ' + JSON.stringify(err));
        return "Error while saving."
      });
  }

  function put(data) {
    return db.post(data);
  }

  function getInputs() {
    var $inputs = $('#myform :input');
    var out = {};
    $inputs.each(function() {
      out[this.name] = $(this).val();
    });

    out.name = out.name.trim();
    out.placename = capitalizeFirstLetter(out.placename.trim());
    out.country = capitalizeFirstLetter(out.country.trim());

    return out;
  }

  $("#myform").submit(function(event) {
    displayMessage('Submitting...');
    event.preventDefault();

    // Validate inputs.
    var inputs = getInputs();
    if (inputs.name === "" || inputs.placename === "" ||
      inputs.country === "") {
      displayMessage('Fill in all the fields please!');
      return;
    }

    queryDbForUser(inputs.name)
      .then(getUserIdFromQueryResult)
      .then(function(userId) {
        // Found user. 
        putLocation(userId, inputs.country, inputs.placename)
          .then(function(data) {
            console.log('put result ' + data);
            displayMessage('Location submitted! ' +
              'Check out <a href="everyone.html">where everyone is</a>.');
          }, function(error) {
            console.log('Couldn\'t submit: ' + error);
            displayMessage('Couldn\'t submit your location : ' + error);
          });
      }, function(error) {
        // Didn't find user.
        console.log('Couldn\'t find userid : ' + error);
        displayMessage(
          'Unknown user. You can <a href="newUserForm.html">create a new user</a>.');
      });

  });
});