module.exports.id = 'schedule-settings';

module.exports.up = function(done) {
  const settingsCollection = this.db.collection('settings');
  const schedulesCollection = this.db.collection('schedules');

  settingsCollection.find().toArray((err, settings) => {
    if (err) return done(err);

    settings.forEach(setting => {
      const userId = setting.user;

      schedulesCollection
        .updateMany(
          { user: userId },
          {
            $set: { 'settings.hourlyWage': setting.hourlyWage },
          }
        )
        .then(() => {
          settingsCollection
            .update({ _id: setting._id }, { $unset: { hourlyWage: '' } })
            .then(() => done())
            .catch(done);
        })
        .catch(done);
    });
  });
};
