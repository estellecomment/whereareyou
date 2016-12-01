function(doc) {
    if (doc.type == 'user') {
        emit(doc._id);
    } else if (doc.type == 'location') {
        emit(doc.user);
    }
}