module.exports.id = 'remove-schedule-data';

module.exports.up = function(done) {
  const schedulesCollection = this.db.collection('schedules');

  schedulesCollection.update(
    {},
    { $unset: { data: 1 } },
    { multi: true },
    done
  );
};
