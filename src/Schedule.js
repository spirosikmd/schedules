import React, { PureComponent } from 'react';
import ScheduleItem from './ScheduleItem';

class Schedule extends PureComponent {
  render() {
    const { schedule, totalHours, totalWeeklyWage } = this.props;
    return (
      <div className="sb-flex sb-flex-column">
        {schedule.map(daySchedule => (
          <ScheduleItem key={daySchedule.date} daySchedule={daySchedule} />
        ))}
        <div>
          <strong>Total Hours:</strong> {totalHours}
        </div>
        <div>
          <strong>Total Weekly Wage:</strong> {totalWeeklyWage.toFixed(2)} EUR
        </div>
      </div>
    );
  }
}

export default Schedule;
