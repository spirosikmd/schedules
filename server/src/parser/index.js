const xlsx = require('node-xlsx').default;
const moment = require('moment-timezone');

class DefaultParser {
  toUTC(year, month, day) {
    return new Date(Date.UTC(year, month, day));
  }

  parseDate(dateToParse, year) {
    const lowercasedDate = dateToParse.toLowerCase();
    const lowercasedWithSingleSpacesDate = lowercasedDate.replace(
      /\s\s+/g,
      ' '
    );
    const dateOnly = lowercasedWithSingleSpacesDate.split(' ')[1];
    const [day, month] = dateOnly.split('-');
    const newMonth = parseInt(month, 10) - 1;
    if (newMonth >= new Date().getMonth() && year > new Date().getFullYear()) {
      year = year - 1;
    }
    return this.toUTC(year, newMonth, parseInt(day, 10));
  }

  parseTime(timeToParse, date, timezone) {
    const replacedTime = timeToParse.replace(';', ':');
    const [hours, minutes] = replacedTime.split(':');
    const timeWithTimezone = moment
      .tz(date, timezone)
      .hours(hours)
      .minutes(minutes);
    return new Date(timeWithTimezone.utc());
  }

  parse(scheduleData, timezone, person) {
    const schedule = xlsx.parse(scheduleData, {
      raw: false,
    });

    const data = [];
    let i = 0;
    while (i < schedule[0].data.length) {
      const row = schedule[0].data[i];
      if (!row[0] || !row[0].startsWith('WEEK')) {
        i++;
        continue;
      }
      const year = row[0].split('-')[1];
      let j = i + 1;
      const date = this.parseDate(schedule[0].data[j][0], parseInt(year, 10));
      const locations = [];
      let daySchedule = schedule[0].data[j];
      while (
        daySchedule &&
        daySchedule[1] !== ' ' &&
        daySchedule[1] !== undefined
      ) {
        const foundLocation = locations.find(
          location => location.name === daySchedule[1]
        );
        const startTime = this.parseTime(daySchedule[3], date, timezone);
        const endTime = this.parseTime(daySchedule[4], date, timezone);
        if (foundLocation) {
          foundLocation.employees.push({
            name: daySchedule[2],
            startTime,
            endTime,
            hours: parseFloat(daySchedule[5]),
          });
        } else {
          const employees = [
            {
              name: daySchedule[2],
              startTime,
              endTime,
              hours: parseFloat(daySchedule[5]),
            },
          ];
          locations.push({
            name: daySchedule[1],
            employees,
          });
        }
        j++;
        daySchedule = schedule[0].data[j];
      }
      data.push({
        date,
        locations,
      });
      i = j;
    }

    // TODO: change the parsing above to create this structure instead of re-iterating.
    const scheduleEntries = [];
    data.forEach(dataItem => {
      const date = dataItem.date;

      dataItem.locations.forEach(location => {
        const locationName = location.name;

        location.employees.forEach(employee => {
          if (employee.name.toLowerCase() !== person.toLowerCase()) return;

          scheduleEntries.push({
            date: new Date(date),
            location: locationName,
            hours: employee.hours,
            startTime: new Date(employee.startTime),
            endTime: new Date(employee.endTime),
            workWith: location.employees
              .filter(
                employee => employee.name.toLowerCase() !== person.toLowerCase()
              )
              .map(employee => employee.name),
          });
        });
      });
    });

    return scheduleEntries;
  }
}

module.exports = DefaultParser;
