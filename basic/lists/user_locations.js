function(head, req) { 
  var utils = require('lib/utils');

  provides("html", function() {
    if (!req.query.hasOwnProperty('key')) {
      return 'No user specified.';
    }

    var row; 
    var locations = [];
    var user;
    while (row = getRow()) {
      var userId = row.key;
      var type = row.value.type;
      if (type === "location") {
        locations.push(row.value);
      } else if (type === "user") {
        user = row.value;
      }
    }
    // Sort locations, newer first
    locations.sort(function(a,b) {
      return b.timestamp_sec - a.timestamp_sec;
    });
    
    html = "<html><body><h1>Where are you " + user.firstname + ' ' + user.lastname + '?</h1><ul>';
    html = html + '<a href="../latest_location/userlocations">Where is everyone?</a>';
    html = html + '<br><a href="../../form.html">I am here</a>';

    if (locations.length == 0) {
      html = html + '<p>' + user.firstname + ' ' + user.lastname + 
      ' has never been seen. Ever. Very mysterious.</p>';
    } else {
      html = html + '<p>' + user.firstname + ' ' + user.lastname + ' was seen</p><ul>';
      for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        var rowHTML = '<li>' +
        '</p><p>on ' + utils.timestampToString(location.timestamp_sec) + 
        '</p><p>in ' + location.placename + 
        ', ' + location.country + '</p></li>';
        html = html + rowHTML;
      }
      html = html + '</ul>';
    }
    
    return html + "</body></html>";
  });
}