import React, { PureComponent } from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class ScheduleHeader extends PureComponent {
  render() {
    return (
      <TableHead>
        <TableRow>
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
}

export default ScheduleHeader;
