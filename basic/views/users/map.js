function(doc) {
 if(doc.type === "user") {
  emit(doc._id, doc.firstname + " " + doc.lastname);
 }
}