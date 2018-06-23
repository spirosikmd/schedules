import React, { Fragment, PureComponent } from 'react';

class Schedule extends PureComponent {
  render() {
    const { schedule, totalHours, totalWeeklyWage } = this.props;
    return (
      <Fragment>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Hours</th>
              <th>Works With</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(daySchedule => (
              <tr key={daySchedule.date}>
                <td>{daySchedule.date}</td>
                <td>{daySchedule.location}</td>
                <td>{daySchedule.startTime}</td>
                <td>{daySchedule.endTime}</td>
                <td>{daySchedule.hours}</td>
                <td>{daySchedule.worksWith.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <strong>Total Hours:</strong> {totalHours}
        </div>
        <div>
          <strong>Total Weekly Wage:</strong> {totalWeeklyWage} EUR
        </div>
      </Fragment>
    );
  }
}

export default Schedule;
