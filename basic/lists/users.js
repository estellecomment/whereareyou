function(head, req) { 
  provides("html", function() {
	  html = "<html><body>Users<ul>";
	      var row; 
	      var latest = {}
	      while (row = getRow()) {
		  html = html + '<li>' + row.value + '</li>';
	      }
    return html + "</ul></body></html>";
  });
}