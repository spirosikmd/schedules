const xlsx = require("node-xlsx").default;

const schedule = xlsx.parse(`${__dirname}/data/2.xlsx`, {
  raw: false
});

const PERSON = "jenny";

console.log({
  schedule: getPersonSchedule(schedule, PERSON),
  totalHours: getTotalHours(schedule, PERSON)
});

// Create person's schedule
function getPersonSchedule(schedule, person) {
  const personSchedule = schedule[0].data.filter(row => {
    return row.length > 1 && row[2] === person;
  });

  return parsePersonSchedule(personSchedule);
}

function parsePersonSchedule(personSchedule) {
  return personSchedule.map(daySchedule => {
    return {
      location: daySchedule[1],
      startTime: daySchedule[3],
      endTime: daySchedule[4],
      hours: parseFloat(daySchedule[5])
    };
  });
}

// Find person's total hours
function getTotalHours(schedule, person) {
  const personIndex = schedule[0].data[28].indexOf(person);

  const totalIndex = schedule[0].data.findIndex(row => {
    return row[0] === "totaal";
  });

  return parseFloat(schedule[0].data[totalIndex - 1][personIndex]);
}
