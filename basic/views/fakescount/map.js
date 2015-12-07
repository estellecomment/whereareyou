function(doc) {
 if(doc.type === "fake") {
  emit('fake', 1);
 }
}