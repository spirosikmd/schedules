const express = require('express');
const fileUpload = require('express-fileupload');
const { parseScheduleFileData } = require('./parser');
const { saveScheduleData, getScheduleDataForPerson } = require('./db');

const app = express();

app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      message: 'No files were uploaded.',
    });
  }

  const { scheduleFile } = req.files;

  const scheduleData = parseScheduleFileData(scheduleFile.data);

  saveScheduleData(scheduleData)
    .then(message => {
      res.json({
        message,
      });
    })
    .catch(error =>
      res.status(400).json({
        message: error,
      })
    );
});

app.get('/schedule', (req, res) => {
  const { person, hourlyWage } = req.query;

  getScheduleDataForPerson(person, hourlyWage)
    .then(data => res.json(data))
    .catch(error => {
      return res.status(400).json({
        message: error,
      });
    });
});

app.listen(5000, () => console.log('Example app listening on port 3000!'));
