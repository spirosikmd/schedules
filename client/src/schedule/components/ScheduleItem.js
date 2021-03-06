import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import EditEntryForm from './EditEntryForm';
import { formatTime } from '../../shared/helpers/dateTime';

function formatDate(dateString) {
  const dateToFormat = new Date(dateString);
  const day = ('0' + dateToFormat.getDate()).slice(-2);
  const month = ('0' + (dateToFormat.getMonth() + 1)).slice(-2);
  return `${dateToFormat.getFullYear()}-${month}-${day}`;
}

const ScheduleItem = React.memo(
  ({ daySchedule, onEditClick, isSelected, onSelect, locations }) => {
    return (
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected} onClick={onSelect} />
        </TableCell>
        <TableCell>{new Date(daySchedule.date).toDateString()}</TableCell>
        <TableCell>{daySchedule.location || '-'}</TableCell>
        <TableCell>{formatTime(daySchedule.startTime)}</TableCell>
        <TableCell>{formatTime(daySchedule.endTime)}</TableCell>
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
              isWorkingAlone={daySchedule.isWorkingAlone}
              onSubmit={onEditClick}
              locations={locations}
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
  locations: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ScheduleItem;
