$(document).ready(function() {
	$.get('_view/fakes').then(function(result) {
		result = JSON.parse(result);
		console.log('got result rows : ' + result.total_rows);
		console.log(result.rows[0]);
		for (var i = 0; i < result.rows.length; i++) {
			deleteDoc(result.rows[i].id, result.rows[i].key);
		}
	});
});

function deleteDoc(id, rev) {
	$.ajax({
		url: '../../' + id + "?rev=" + rev,
		type: 'DELETE'
	}).then(
		function(data) {
			console.log('successful delete for ' + id + " - " + data);
		},
		function(err) {
			console.log('failed delete for ' + id + " - " + err);
		});
}