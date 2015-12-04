function (keys, values, rereduce) {
  var latest = {timestamp_sec: 0};  
  for (var i = 0; i < values.length; i ++) {
    if (values[i].timestamp_sec > latest.timestamp_sec) {
      latest = values[i];
    }
  }
  return latest;
}