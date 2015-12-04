$(document).ready(function() {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function displayMessage(messageString) {
    $('#messages').html(messageString);
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

    out.firstname = capitalizeFirstLetter(out.firstname.trim());
    out.lastname = capitalizeFirstLetter(out.lastname.trim());

    return out;
  }

  $("#myform").submit(function(event) {
    displayMessage('Submitting...');
    event.preventDefault();

    var inputs = getInputs();
    if (inputs.firstname === "" || inputs.lastname === "") {
      displayMessage('Fill in all the fields please!');
      return;
    }

    // Now put that user!
    var userData = {};
    userData.type = "user";
    userData.firstname = inputs.firstname;
    userData.lastname = inputs.lastname;
    put(userData)
      .then(function(data) {
        console.log('put result ' + data);
        displayMessage('New user created. Do your first <a href="form.html">check in</a>!');
      }, function(errorThrown) {
        console.log('Couldn\'t submit : ' + JSON.stringify(errorThrown));
        displayMessage('Couldn\'t create user, sorry.');
      });
  });
});