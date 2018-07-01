import React, { PureComponent } from 'react';

function renderTime(time) {
  const date = new Date(time);
  const minutes = date.getMinutes();
  return `${date.getHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
}

class ScheduleItem extends PureComponent {
  render() {
    const { daySchedule } = this.props;

    return (
      <div className="sb-tile sb-margin-bottom-s">
        <div className="sb-flex">
          <div className="sb-padding" style={{ flex: 3 }}>
            {new Date(daySchedule.date).toDateString()}
          </div>
          <div className="sb-padding" style={{ flex: 1 }}>
            {daySchedule.location}
          </div>
          <div className="sb-padding" style={{ flex: 2 }}>
            {renderTime(daySchedule.startTime)}
          </div>
          <div className="sb-padding" style={{ flex: 2 }}>
            {renderTime(daySchedule.endTime)}
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
