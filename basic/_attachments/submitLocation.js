$( document ).ready(function() {
	function capitalizeFirstLetter(string) {
  		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function displayMessage(messageString) {
		$('#messages').html(messageString);
	}
	
	$("#myform").submit(function( event ) {
		displayMessage('Submitting...');
		event.preventDefault();

		// Validate inputs.
		var $inputs = $('#myform :input');
		var values = {};
		$inputs.each(function() {
			values[this.name] = $(this).val();
		    });

		values.firstname = capitalizeFirstLetter(values.firstname.trim());
		values.lastname = capitalizeFirstLetter(values.lastname.trim());
		values.placename = capitalizeFirstLetter(values.placename.trim());
		values.country = capitalizeFirstLetter(values.country.trim());
		if (values.firstname === "" || values.lastname === "" || values.placename === "" ||
			values.country === "") {
			displayMessage('Fill in all the fields please!');
			return;
		}

		// Get the userId for this user.
		$.get('_view/usersbyname?key="' + values.firstname + '%20' + values.lastname + '"', function( data ) {
			console.log('got data : ' + data);
			var users = JSON.parse(data).rows;
			if (users.length == 0) {
			    console.log('Unknown user : ' + values.firstname + ' ' + values.lastname);
			    displayMessage('Unknown user : ' + values.firstname + ' ' + values.lastname +
					   '. You can <a href="newUserForm.html">create a new user</a>.');
			    return;
			} 
			if (users.length > 1) {
			    console.log('More then one user with name ' + values.firstname + ' ' + values.lastname);
			    displayMessage('Something went wrong, we found two copies of you... Sorry.');
			    return;
			}
			var userId = users[0].id;
			console.log('got userId : ' + userId);
			
			// Get a UUID from CouchDB
			$.get('../../../_uuids', function(data) {
				console.log('got uuid : ' + data);
				var uuid = JSON.parse(data).uuids[0];
				
				// Now put that location!
				var locationData = {};
				locationData.user = userId;
				locationData.type = "location";
				locationData.country = values.country;
				locationData.placename = values.placename;
				locationData.timestamp_sec = Math.floor(Date.now() / 1000); // in millis would have been better...
				$.ajax({
					method: 'PUT',
					    url: '../../' + uuid,
					    data: JSON.stringify(locationData)
					    })
				.done(function(data) {
				    console.log('put result ' + data);
				    displayMessage('Location submitted! Check out <a href="_list/latest_location/userlocations">where everyone is</a>.');
					})
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.log('Couldn\'t submit : ' + errorThrown);
					displayMessage('Couldn\'t submit your location, sorry.');
				});
			    });
		    });
		// TODO chain ajax calls properly
	    });
    });