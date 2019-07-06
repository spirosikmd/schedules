import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ResponsiveConfirmDeleteDialog from '../../shared/components/ResponsiveConfirmDeleteDialog';

const styles = theme => ({
  item: {
    padding: theme.spacing(),
  },
  editContainer: {
    paddingLeft: theme.spacing(2),
  },
  scheduleLink: {
    paddingLeft: theme.spacing(),
  },
});

function ScheduleListItem({
  schedule,
  classes,
  newScheduleName,
  editingScheduleId,
  onNewScheduleNameChange,
  onCancelEditClick,
  onUpdateScheduleName,
  onScheduleEdit,
  onScheduleDelete,
}) {
  return (
    <Grid item xs={12} key={schedule.id}>
      <Paper className={classes.item}>
        <Grid container alignItems="center">
          <Grid item xs={8}>
            {editingScheduleId !== schedule.id ? (
              <Typography className={classes.scheduleLink}>
                <Link to={`/schedules/${schedule.id}`}>{schedule.name}</Link>
              </Typography>
            ) : (
              <Grid container className={classes.editContainer} spacing={1}>
                <Grid item>
                  <TextField
                    id="newScheduleName"
                    value={newScheduleName}
                    onChange={onNewScheduleNameChange}
                    autoFocus
                  />
                </Grid>
                <Grid item>
                  <Button color="secondary" onClick={onCancelEditClick}>
                    cancel
                  </Button>
                  <Button color="primary" onClick={onUpdateScheduleName}>
                    update
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={4}>
            <Grid container justify="flex-end">
              <IconButton
                aria-label="Edit schedule name"
                onClick={onScheduleEdit}
              >
                <EditIcon />
              </IconButton>
              <ResponsiveConfirmDeleteDialog
                title="Delete schedule?"
                content="All the schedule data will be removed permanently and you won't be
                      able to retrieve them again."
                onDeleteClick={onScheduleDelete}
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

ScheduleListItem.propTypes = {
  schedule: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScheduleListItem);
