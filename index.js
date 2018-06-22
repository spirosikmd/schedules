const express = require("express");
const { getScheduleAndTotalHoursForPerson } = require("./utils");

const app = express();

app.get("/schedule", (req, res) => {
  // TODO: These should be provided by the UI
  const PERSON = "jenny";
  const FILE = `${__dirname}/data/1.xlsx`;
  res.json(getScheduleAndTotalHoursForPerson(FILE, PERSON));
});

app.listen(5000, () => console.log("Example app listening on port 3000!"));
