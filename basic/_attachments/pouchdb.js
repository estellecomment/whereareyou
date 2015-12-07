// Export the db variable.
var db;
var dbName = 'whereareyou';
var waitMessage = 'Database is loading, please wait...';

function displayDbMessage(messageString) {
  $('#dbloadmessage').html(messageString);
}

function displayReplicationStatus(remoteDocCount) {
  getLocalDocCount().then(function(count) {
    var percentDone = count / remoteDocCount * 100;
    displayDbMessage(waitMessage + " " + percentDone.toFixed(0) + "% done... (" +
      count + '/' + remoteDocCount + ")");
  });
}

function clearDbMessage() {
  displayDbMessage('');
}

function getDbInfo() {
  db.info().then(function(info) {
    console.log(info);
  });
}

function printLocalDocCount() {
  getLocalDocCount().then(function(count) {
    console.log('Local doc count : ' + count);
  });
}

function getLocalDocCount() {
  return db.info().then(function(info) {
    return Promise.resolve(info.doc_count); // JS promise
  });
}

function getRemoteDocCount(remoteDbUrl) {
  return $.get(remoteDbUrl).then(function(info) {
    return JSON.parse(info).doc_count;
  });
}

function findRemoteDb() {
  var remoteCouch;
  if (window.location.origin === "https://whereareyou.cloudant.com") {
    remoteCouch = "https://whereareyou:wherewherewhere@whereareyou.cloudant.com";
  } else if (window.location.origin === "http://127.0.0.1:5984") {
    remoteCouch = "http://admin:pass@127.0.0.1:5984";
  }
  var dbname = window.location.pathname.split('/')[1];
  remoteCouch = remoteCouch + '/' + dbname;
  return remoteCouch;
}

function runSync(remoteCouch, isLive, onPaused, onComplete) {
  return PouchDB.sync(dbName, remoteCouch, {
      live: isLive,
      retry: true
    })
    .on('change', function(info) {
      // Note : doesn't fire in one-time syncs.
      console.log('replication : change : ' + info.direction + " - docs_written : " + info.change.docs_written +
        ' - docs_read : ' + info.changes.docs_read);
      printLocalDocCount();
    })
    .on('paused', onPaused)
    .on('active', function() {
      // replicate resumed (e.g. user went back online)
      console.log('replication : active');
    })
    .on('denied', function(info) {
      // a document failed to replicate, e.g. due to permissions
      console.log('replication : denied ' + JSON.stringify(info));
    })
    .on('complete', onComplete)
    .on('error', function(err) {
      // handle error
      console.log('replication : error ' + JSON.stringify(err));
    });
}

function runOneTimeSync(remoteCouch, onPaused, onComplete) {
  return runSync(remoteCouch, false, onPaused, onComplete);
}

function runLiveSync(remoteCouch) {
  return runSync(remoteCouch, true, function() {
    console.log('replication : paused');
  }, function() {});
}

$(document).ready(function() {
  db = new PouchDB(dbName);

  var remoteCouch = findRemoteDb();
  displayDbMessage(waitMessage);

  // Syncing : 
  // Are you online? 
  //    If yes, do you have the same number of docs as the couchdb?
  //        If no, run a one-time sync. When done, start the live sync.
  //        If yes, start the live sync.
  //    If no : start the live sync, in case you get online later. 
  getLocalDocCount().then(
    function(localDocCount) {
      console.log('local online! doc_count : ' + localDocCount);
      getRemoteDocCount(remoteCouch).then(
        function(remoteDocCount) {
          console.log('remote online! doc_count : ' + remoteDocCount);
          if (localDocCount == remoteDocCount) {
            console.log('All docs are replicated. Starting live sync');
            clearDbMessage();
            runLiveSync(remoteCouch);
          } else {
            console.log('Some docs are not replicated yet. Starting one-time sync');
            displayReplicationStatus(remoteDocCount);
            runOneTimeSync(
              remoteCouch,
              function() {
                console.log('replication : paused');
                displayReplicationStatus(remoteDocCount);
              },
              function() {
                console.log('One-time replication is done! Starting live replication.');
                clearDbMessage();
                runLiveSync(remoteCouch);
              });
          }
        },
        function() {
          console.log('remote offline');
          displayDbMessage('You are offline. Some database files may be missing.');
          runLiveSync(remoteCouch);
        });
    },
    function() {
      console.log('wtf can\'t reach local db');
      displayDbMessage('Local database doesn\t respond. All bets are off. Try reloading?');
    });
});