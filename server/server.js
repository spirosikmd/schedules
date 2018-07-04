const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const {
  saveScheduleData,
  getScheduleDataForPerson,
  getSchedules,
  getSelectedScheduleId,
  getHourlyWage,
  updateSchedule,
} = require('./db');
const { parseScheduleFileData } = require('./parser');

const PORT = process.env.PORT || 5000;

const app = express();
const upload = multer();

app.use(bodyParser.json());

app.get('/api/schedules', (req, res) => {
  getSchedules()
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
});

app.post('/api/schedules', upload.single('scheduleFile'), (req, res) => {
  const { buffer, originalname } = req.file;

  const scheduleData = parseScheduleFileData(buffer);

  saveScheduleData(originalname, scheduleData)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
});

app.get('/api/selected-schedule-id', (req, res) => {
  getSelectedScheduleId()
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
});

app.put('/api/schedules/:scheduleId', (req, res) => {
  const { scheduleId } = req.params;
  const data = req.body;

  updateSchedule(scheduleId, data)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
});

app.get('/api/schedules/:scheduleId/generate', (req, res) => {
  const { scheduleId } = req.params;
  const { person, hourlyWage } = req.query;

  getScheduleDataForPerson(scheduleId, person.toLowerCase(), hourlyWage)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
});

app.get('/api/hourly-wage', (req, res) => {
  getHourlyWage()
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '..', 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
