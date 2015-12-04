// Export the db variable.
var db;

$(document).ready(function() {
  db = new PouchDB('whereareyou');
  var remoteCouch = '';

  // Find the remote DB to sync with.
  if (window.location.origin === "https://whereareyou.cloudant.com") {
    remoteCouch = "https://whereareyou:wherewherewhere@whereareyou.cloudant.com";
  } else if (window.location.origin === "http://127.0.0.1:5984") {
    remoteCouch = "http://admin:pass@127.0.0.1:5984";
  }
  var dbname = window.location.pathname.split('/')[1];
  remoteCouch = remoteCouch + '/' + dbname;

  // Sync
  var sync = PouchDB.sync('whereareyou', remoteCouch, {
    live: true,
    retry: true
  }).on('change', function(info) {
    console.log('replication : change ' + JSON.stringify(info));
  }).on('paused', function() {
    // replication paused (e.g. user went offline)
    console.log('replication : paused');
  }).on('active', function() {
    // replicate resumed (e.g. user went back online)
    console.log('replication : active');
  }).on('denied', function(info) {
    // a document failed to replicate, e.g. due to permissions
    console.log('replication : denied ' + JSON.stringify(info));
  }).on('complete', function(info) {
    // handle complete
    console.log('replication : complete ' + JSON.stringify(info));
  }).on('error', function(err) {
    // handle error
    console.log('replication : error ' + JSON.stringify(err));
  });

  // Query DB info
  db.info().then(function(result) {
    console.log('Pouchdb info : ' + JSON.stringify(result));
  }).catch(function(err) {
    console.log(err);
  });

});