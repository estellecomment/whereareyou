function(doc) {
    if(doc.type === "user") {
	emit(doc.firstname + " " + doc.lastname, doc._id);
    }
}