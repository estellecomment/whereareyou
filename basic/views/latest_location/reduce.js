function (keys, values, rereduce) {
  var latest = {timestamp_millis: 0};  
  for (var i = 0; i < values.length; i ++) {
    if (values[i].timestamp_millis > latest.timestamp_millis) {
      latest = values[i];
    }
  }
  return latest;
}