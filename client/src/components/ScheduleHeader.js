import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';

const ScheduleHeader = React.memo(
  ({ numSelected, rowCount, onSelectAllClick }) => {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Start Time</TableCell>
          <TableCell>End Time</TableCell>
          <TableCell align="right">Hours</TableCell>
          <TableCell align="right">Wage</TableCell>
          <TableCell>Work With</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
    );
  }
);

ScheduleHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
};

export default ScheduleHeader;
