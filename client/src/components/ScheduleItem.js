import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import EditEntryForm from './EditEntryForm';

function renderTime(time) {
  if (!time) return '-';
  const date = new Date(time);
  const minutes = date.getMinutes();
  return `${date.getHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function formatDate(dateString) {
  const dateToFormat = new Date(dateString);
  const day = ('0' + dateToFormat.getDate()).slice(-2);
  const month = ('0' + (dateToFormat.getMonth() + 1)).slice(-2);
  return `${dateToFormat.getFullYear()}-${month}-${day}`;
}

const ScheduleItem = React.memo(
  ({ daySchedule, onEditClick, isSelected, onSelect }) => {
    return (
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected} onClick={onSelect} />
        </TableCell>
        <TableCell>{new Date(daySchedule.date).toDateString()}</TableCell>
        <TableCell>{daySchedule.location || '-'}</TableCell>
        <TableCell>{renderTime(daySchedule.startTime)}</TableCell>
        <TableCell>{renderTime(daySchedule.endTime)}</TableCell>
        <TableCell align="right">{daySchedule.hours}</TableCell>
        <TableCell align="right">{daySchedule.dayWage.toFixed(2)}</TableCell>
        <TableCell>
          {(daySchedule.workWith && daySchedule.workWith.join(', ')) || '-'}
        </TableCell>
        <TableCell>
          <Grid container justify="flex-end">
            <EditEntryForm
              date={formatDate(daySchedule.date)}
              hours={daySchedule.hours}
              startTime={daySchedule.startTime}
              endTime={daySchedule.endTime}
              location={daySchedule.location}
              workWith={daySchedule.workWith}
              onSubmit={onEditClick}
            />
          </Grid>
        </TableCell>
      </TableRow>
    );
  }
);

ScheduleItem.propTypes = {
  daySchedule: PropTypes.object.isRequired,
  onEditClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ScheduleItem;
