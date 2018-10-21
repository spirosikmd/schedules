module.exports.id = 'schedule-data-entries';

module.exports.up = function(done) {
  const schedulesCollection = this.db.collection('schedules');
  const scheduleEntriesCollection = this.db.collection('schedule-entries');
  const settingsCollection = this.db.collection('settings');

  schedulesCollection.find().toArray((err, schedules) => {
    if (err) return done(err);

    const operations = schedules.map(schedule => {
      const scheduleId = schedule._id;
      const userId = schedule.user;

      return settingsCollection.findOne({ user: userId }).then(settings => {
        const person = settings.person;

        const dataOperations = schedule.data.map(dataItem => {
          const date = dataItem.date;

          const scheduleEntries = [];
          dataItem.locations.forEach(location => {
            const locationName = location.name;

            location.employees.forEach(employee => {
              if (employee.name !== person) return;

              scheduleEntries.push({
                date: new Date(date),
                hours: employee.hours,
                schedule: scheduleId,
                user: userId,
                location: locationName,
                startTime: new Date(employee.startTime),
                endTime: new Date(employee.endTime),
                workWith: location.employees
                  .filter(employee => employee.name !== person)
                  .map(employee => employee.name),
              });
            });
          });

          if (scheduleEntries.length === 0) return;

          return scheduleEntriesCollection.insertMany(scheduleEntries);
        });

        return Promise.all(dataOperations);
      });
    });

    Promise.all(operations)
      .then(() => done())
      .catch(done);
  });
};
