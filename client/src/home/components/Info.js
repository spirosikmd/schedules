import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { formatTime } from '../../shared/helpers/dateTime';

const styles = theme => ({
  info: {
    padding: theme.spacing.unit * 2,
  },
  separator: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

const Info = ({
  holyTotal,
  nextWorkingDate,
  bestSchedule,
  highestLocation,
  classes,
}) => (
  <Paper className={classes.info}>
    {nextWorkingDate && (
      <div>
        <Typography>You work again on</Typography>
        <Typography variant="h5">
          {new Date(nextWorkingDate.date).toDateString()}
        </Typography>
        <Typography variant="subtitle1">
          {formatTime(nextWorkingDate.startTime)} to{' '}
          {formatTime(nextWorkingDate.endTime)}
        </Typography>
      </div>
    )}
    {holyTotal > 0 && (
      <>
        <div className={classes.separator} />
        <div>
          <Typography>Holy total</Typography>
          <Typography variant="h5">€{holyTotal.toFixed(2)}</Typography>
        </div>
      </>
    )}
    {bestSchedule && (
      <>
        <div className={classes.separator} />
        <div>
          <Typography>Your best schedule</Typography>
          <Typography variant="h5">
            €{bestSchedule.weeklyWage.toFixed(2)}
          </Typography>
          <Typography variant="subtitle1">
            {bestSchedule.name} with {bestSchedule.hours} hours
          </Typography>
        </div>
      </>
    )}
    {highestLocation && (
      <>
        <div className={classes.separator} />
        <div>
          <Typography>You work mostly on</Typography>
          <Typography variant="h5">{highestLocation.name}</Typography>
          <Typography variant="subtitle1">
            {highestLocation.numberOfTimes} times and total{' '}
            {highestLocation.hours} hours
          </Typography>
        </div>
      </>
    )}
  </Paper>
);

Info.propTypes = {
  classes: PropTypes.object.isRequired,
  holyTotal: PropTypes.number.isRequired,
  nextWorkingDate: PropTypes.shape({
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
  }),
  bestSchedule: PropTypes.shape({
    weeklyWage: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
  }),
  highestLocation: PropTypes.shape({
    name: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
    numberOfTimes: PropTypes.number.isRequired,
  }),
};

export default withStyles(styles)(Info);
