$(document).ready(function() {
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

    out.name = out.name.trim();

    return out;
  }

  $("#myform").submit(function(event) {
    displayMessage('Submitting...');
    event.preventDefault();

    var inputs = getInputs();
    if (inputs.name === "") {
      displayMessage('Fill in all the fields please!');
      return;
    }

    // Now put that user!
    var userData = {};
    userData.type = "user";
    userData.name = inputs.name;
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