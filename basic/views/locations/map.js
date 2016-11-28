function(doc) {
  if (doc.type === "location") {
    emit(doc.user, null);
  }
}