module.exports.id = 'add-is-working-alone-schedule-entry';

module.exports.up = function(done) {
  const scheduleEntriesCollection = this.db.collection('schedule-entries');

  scheduleEntriesCollection.update(
    {},
    { $set: { isWorkingAlone: false } },
    { multi: true },
    done
  );
};
