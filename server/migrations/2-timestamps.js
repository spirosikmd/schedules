module.exports.id = 'timestamps';

function dateFromObjectId(objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

function updateCollectionTimestamps(collection) {
  return new Promise((resolve, reject) => {
    collection.find().toArray((err, documents) => {
      if (err) return done(err);

      const operations = documents.map(document => {
        return collection.update(
          { _id: document._id },
          {
            $set: {
              createdAt: dateFromObjectId(document._id.toString()),
              updatedAt: new Date(),
            },
          }
        );
      });

      Promise.all(operations)
        .then(resolve)
        .catch(reject);
    });
  });
}

module.exports.up = function(done) {
  const settingsCollection = this.db.collection('settings');
  const usersCollection = this.db.collection('users');
  const schedulesCollection = this.db.collection('schedules');

  Promise.all([
    updateCollectionTimestamps(settingsCollection),
    updateCollectionTimestamps(usersCollection),
    updateCollectionTimestamps(schedulesCollection),
  ])
    .then(() => done())
    .catch(done);
};
