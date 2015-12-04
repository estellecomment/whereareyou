function(doc) {
    if (doc.type == 'user') {
        emit(doc._id, doc);
    } else if (doc.type == 'location') {
        emit(doc.user, doc);
    }
}