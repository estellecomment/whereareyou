function(head, req) { 

    provides("html", function() {
		var utils = require('lib/utils');

		// Find the latest location for each user.
		// TODO : do this with the reduce function. Currently doesn't work, the list only displays one row.
		var row; 
		var latest = {}
		var users = {}
		while (row = getRow()) {
			var userId = row.key;
			var type = row.value.type;
			if (type === "location") {
		    	if (!latest.hasOwnProperty(userId) || latest[userId].timestamp_sec < row.value.timestamp_sec) {
					latest[userId] = row.value;
			    }
			} else if (type == "user") {
		    	users[userId] = row.value;
			}
		}
	    
	    html = "<html><body><h1>Where is everyone?</h1><ul>";
  	    html = html + '<a href="../../form.html">I am here</a>';
	    for (userId in users) {
			var user = users[userId];
			var userHTML = '<p><a href="../user_locations/userlocations?key=%22' + userId + 
				'%22">' + user.name + '</a></p>';
		    var rowHTML;
			if (latest.hasOwnProperty(userId)) {
				var location = latest[userId];	
				rowHTML = 
			    	'<p>was last seen in ' + location.placename + ', ' + location.country + 
		    		'</p><p>on ' + utils.timestampToString(location.timestamp_sec) +
		    		'</p>';
			} else {
				rowHTML = '<p>was never seen. Ever. Anywhere. Maybe not a real person.</p>';
			}
			html = html + '<li>' +  userHTML + rowHTML + '</li>';
	    }
	    
	    return html + "</ul></body></html>";
	});
}