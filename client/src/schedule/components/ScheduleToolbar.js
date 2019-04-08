import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import ResponsiveConfirmDeleteDialog from '../../shared/components/ResponsiveConfirmDeleteDialog';
import CreateEntryForm from './CreateEntryForm';
import ScheduleSettings from './ScheduleSettings';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  toolbar: {
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing.unit,
    },
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
});

const ScheduleToolbar = ({
  classes,
  name,
  numSelected,
  hourlyWage,
  locations,
  onDeleteEntries,
  onCreateEntry,
  onSettingsSave,
  onCreateEventForEntry,
}) => {
  return (
    <Toolbar
      className={classNames(classes.toolbar, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              {name}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <Grid container alignItems="center">
            {numSelected > 0 ? (
              <Fragment>
                <IconButton
                  onClick={onCreateEventForEntry}
                  aria-label="Create event for entry"
                >
                  <CalendarIcon />
                </IconButton>
                <ResponsiveConfirmDeleteDialog
                  title="Delete selected entries?"
                  content="Are you sure you want to delete the selected entries?"
                  onDeleteClick={onDeleteEntries}
                />
              </Fragment>
            ) : (
              <>
                <Grid item>
                  <CreateEntryForm
                    onSubmit={onCreateEntry}
                    locations={locations}
                  />
                </Grid>
                {hourlyWage !== undefined && hourlyWage !== null && (
                  <Grid item>
                    <ScheduleSettings
                      hourlyWage={hourlyWage}
                      onSave={onSettingsSave}
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

ScheduleToolbar.propTypes = {
  name: PropTypes.string,
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  hourlyWage: PropTypes.number,
  locations: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDeleteEntries: PropTypes.func.isRequired,
  onCreateEntry: PropTypes.func.isRequired,
  onSettingsSave: PropTypes.func.isRequired,
  onCreateEventForEntry: PropTypes.func.isRequired,
};

export default withStyles(styles)(ScheduleToolbar);
