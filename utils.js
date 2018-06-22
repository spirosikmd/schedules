const xlsx = require("node-xlsx").default;

module.exports = {
  getScheduleAndTotalHoursForPerson(file, person) {
    const schedule = xlsx.parse(file, {
      raw: false
    });

    return {
      schedule: getPersonSchedule(schedule, person),
      totalHours: getTotalHours(schedule, person)
    };
  }
};

// Create person's schedule
function getPersonSchedule(schedule, person) {
  const personSchedule = [];
  let i = 0;
  while (i < schedule[0].data.length) {
    const row = schedule[0].data[i];
    if (!row[0] || !row[0].startsWith("WEEK")) {
      i++;
      continue;
    }
    let j = i + 1;
    const date = schedule[0].data[j][0];
    let daySchedule = schedule[0].data[j];
    while (daySchedule[1] !== " ") {
      if (daySchedule[2] === person) {
        personSchedule.push(parseDayScheduleWithDate(daySchedule, date));
        break;
      }
      j++;
      daySchedule = schedule[0].data[j];
    }
    i = j;
  }
  return personSchedule;
}

function parseDayScheduleWithDate(daySchedule, date) {
  return {
    date: date.toLowerCase().trim(),
    location: daySchedule[1],
    startTime: daySchedule[3],
    endTime: daySchedule[4],
    hours: parseFloat(daySchedule[5])
  };
}

// Find person's total hours
function getTotalHours(schedule, person) {
  const personIndex = schedule[0].data[28].indexOf(person);

  const totalIndex = schedule[0].data.findIndex(row => {
    return row[0] === "totaal";
  });

  return parseFloat(schedule[0].data[totalIndex - 1][personIndex]);
}
