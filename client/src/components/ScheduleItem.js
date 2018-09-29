import React, { PureComponent } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

function renderTime(time) {
  const date = new Date(time);
  const minutes = date.getMinutes();
  return `${date.getHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
}

class ScheduleItem extends PureComponent {
  render() {
    const { daySchedule } = this.props;

    return (
      <TableRow>
        <TableCell>{new Date(daySchedule.date).toDateString()}</TableCell>
        <TableCell>{daySchedule.location}</TableCell>
        <TableCell>{renderTime(daySchedule.startTime)}</TableCell>
        <TableCell>{renderTime(daySchedule.endTime)}</TableCell>
        <TableCell numeric>{daySchedule.hours}</TableCell>
        <TableCell numeric>{daySchedule.dayWage.toFixed(2)}</TableCell>
        <TableCell>{daySchedule.worksWith.join(', ')}</TableCell>
      </TableRow>
    );
  }
}

export default ScheduleItem;
