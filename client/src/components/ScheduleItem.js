import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import ResponsiveConfirmDeleteDialog from './ResponsiveConfirmDeleteDialog';
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
  ({ daySchedule, onEditClick, onDeleteClick }) => {
    return (
      <TableRow>
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
            <ResponsiveConfirmDeleteDialog
              title="Delete entry?"
              content="Are you sure you want to delete this schedule entry?"
              onDeleteClick={onDeleteClick}
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
  onDeleteClick: PropTypes.func.isRequired,
};

export default ScheduleItem;
