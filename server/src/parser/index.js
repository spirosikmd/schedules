const xlsx = require('node-xlsx').default;

module.exports = {
  parseScheduleFileData,
};

function parseDate(dateToParse) {
  const lowercasedDate = dateToParse.toLowerCase();
  const lowercasedWithSingleSpacesDate = lowercasedDate.replace(/\s\s+/g, ' ');
  const dateOnly = lowercasedWithSingleSpacesDate.split(' ')[1];
  const [day, month] = dateOnly.split('-');
  const newDate = new Date(
    Date.UTC(2018, parseInt(month, 10) - 1, parseInt(day, 10))
  );
  return newDate;
}

function parseTime(timeToParse, date) {
  const time = new Date(date.getTime());
  const replacedTime = timeToParse.replace(';', ':');
  const [hours, minutes] = replacedTime.split(':');
  time.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return time;
}

function parseScheduleFileData(scheduleData) {
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
    let j = i + 1;
    const date = parseDate(schedule[0].data[j][0]);
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
      const startTime = parseTime(daySchedule[3], date);
      const endTime = parseTime(daySchedule[4], date);
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

  return data;
}