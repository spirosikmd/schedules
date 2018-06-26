const xlsx = require('node-xlsx').default;

module.exports = {
  parseScheduleFileWithPath,
};

function parseScheduleFileWithPath(scheduleData) {
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
    const date = schedule[0].data[j][0];
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
      if (foundLocation) {
        foundLocation.employees.push({
          name: daySchedule[2],
          startTime: daySchedule[3],
          endTime: daySchedule[4],
          hours: parseFloat(daySchedule[5]),
        });
      } else {
        const employees = [
          {
            name: daySchedule[2],
            startTime: daySchedule[3],
            endTime: daySchedule[4],
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
