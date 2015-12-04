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
		if (values.firstname === "" || values.lastname === "") {
			displayMessage('Fill in all the fields please!');
			return;
		}

		// Get a UUID from CouchDB
		$.get('../../../_uuids', function(data) {
			console.log('got uuid : ' + data);
			var uuid = JSON.parse(data).uuids[0];
			
			// Now put that user!
			var userData = {};
			userData.type = "user";
			userData.firstname = values.firstname;
			userData.lastname = values.lastname;
			$.ajax({
				method: 'PUT',
				    url: '../../' + uuid,
				    data: JSON.stringify(userData)
					    })
			    .done(function(data) {
				    console.log('put result ' + data);
				    displayMessage('New user created. Do your first <a href="form.html">check in</a>!');
				})
			    .fail(function(jqXHR, textStatus, errorThrown) {
				    console.log('Couldn\'t submit : ' + errorThrown);
				    displayMessage('Couldn\'t create user, sorry.');
				});
		    });
	    });
	// TODO chain ajax calls properly
    });
