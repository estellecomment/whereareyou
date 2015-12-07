function(doc) {
 if(doc.type === "fake") {
  emit(doc._rev, null);
 }
}