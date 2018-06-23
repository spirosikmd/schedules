const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const { getScheduleAndTotalHoursForPerson } = require('./parser');

const app = express();

app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files)
    return res.status(400).json({
      message: 'No files were uploaded.',
    });

  const scheduleFile = req.files.scheduleFile;
  const person = req.body.person;

  const schedule = getScheduleAndTotalHoursForPerson(
    scheduleFile.data,
    person.toLowerCase()
  );

  fs.writeFile(
    `${__dirname}/data/data.json`,
    JSON.stringify(schedule),
    'utf8',
    error => {
      if (error) {
        return res.status(400).json({
          message: 'Error parsing schedule file.',
        });
      }

      res.json({
        message: 'ok',
      });
    }
  );
});

app.get('/schedule', (req, res) => {
  const person = req.query.person;
  fs.readFile(`${__dirname}/data/data.json`, (error, data) => {
    if (error) {
      return res.status(400).json({
        message: 'Error getting schedule file.',
      });
    }

    res.json(JSON.parse(data));
  });
});

app.listen(5000, () => console.log('Example app listening on port 3000!'));
