import React, { PureComponent } from 'react';

class ScheduleItem extends PureComponent {
  render() {
    const { daySchedule } = this.props;

    return (
      <div className="sb-tile sb-margin-bottom-s">
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
    );
  }
}

export default ScheduleItem;
