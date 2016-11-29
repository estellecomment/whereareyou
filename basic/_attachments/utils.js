var numMillisInDay = 24 * 60 * 60 * 1000;

var timestampToString = function(timestamp_millis) {
  date = new Date(timestamp_millis * 1000);
  var today = new Date();
  var daysAgo = Math.round(Math.abs((today.getTime() - date.getTime()) / (numMillisInDay)));
  var dateString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  if (daysAgo == 0) {
    dateString = dateString + ' (today)';
  } else if (daysAgo == 1) {
    dateString = dateString + ' (yesterday)';
  } else {
    dateString = dateString + ' (' + daysAgo + ' days ago)'
  }
  return dateString;
};

var getInputs = function(formSelector) {
  var $inputs = $(formSelector + ' :input');
  var out = {};
  $inputs.each(function() {
    out[this.name] = $(this).val().trim();
  });
  return out;
}

var displayMessage = function(messageString) {
  $('#messages').html(messageString);
}