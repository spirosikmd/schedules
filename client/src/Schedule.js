import React, { PureComponent } from 'react';

class Schedule extends PureComponent {
  render() {
    const { schedule, totalHours, totalWeeklyWage } = this.props;
    return (
      <div className="sb-flex sb-flex-column">
        {schedule.map(daySchedule => (
          <div key={daySchedule.date} className="sb-tile sb-margin-bottom-s">
            <div className="sb-flex">
              <div className="sb-padding" style={{ flex: 3 }}>
                {daySchedule.date}
              </div>
              <div className="sb-padding" style={{ flex: 1 }}>
                {daySchedule.location}
              </div>
              <div className="sb-padding" style={{ flex: 2 }}>
                {daySchedule.startTime}
              </div>
              <div className="sb-padding" style={{ flex: 2 }}>
                {daySchedule.endTime}
              </div>
              <div className="sb-padding" style={{ flex: 1 }}>
                {daySchedule.hours}
              </div>
              <div className="sb-padding" style={{ flex: 4 }}>
                {daySchedule.worksWith.join(', ')}
              </div>
            </div>
          </div>
        ))}
        <div>
          <strong>Total Hours:</strong> {totalHours}
        </div>
        <div>
          <strong>Total Weekly Wage:</strong> {totalWeeklyWage} EUR
        </div>
      </div>
    );
  }
}

export default Schedule;
