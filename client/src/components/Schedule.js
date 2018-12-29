import React, { PureComponent, Suspense, lazy } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { withStyles } from '@material-ui/core/styles';
import {
  fetchSchedule,
  createEvents,
  updateSchedule,
  createScheduleEntries,
  deleteScheduleEntry,
  updateScheduleEntry,
} from '../api';
import withAuth from './withAuth';
import Loader from './Loader';
import CreateEntryForm from './CreateEntryForm';
import { Toolbar } from '@material-ui/core';

const ScheduleItem = lazy(() => import('./ScheduleItem'));
const ScheduleHeader = lazy(() => import('./ScheduleHeader'));
const ScheduleSettings = lazy(() => import('./ScheduleSettings'));
const MessageSnackbar = lazy(() => import('./MessageSnackbar'));

const styles = theme => ({
  table: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  info: {
    marginTop: theme.spacing.unit * 2,
  },
  toolbar: {
    paddingRight: theme.spacing.unit,
  },
});

class Schedule extends PureComponent {
  state = {
    schedule: {},
    isCreatingEvents: false,
    isLoading: true,
    isSnackbarOpen: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
  };

  componentDidMount() {
    this.getSchedule();
  }

  handleBackButtonClick = event => {
    event.preventDefault();
    this.props.navigate('/');
  };

  handleCreateEventsClick = () => {
    this.setState({ isCreatingEvents: true });

    createEvents(this.state.schedule.schedule)
      .then(events => {
        events.forEach(event => {
          console.log(
            `Event created: ${event.created} | ${event.description} | ${
              event.location
            }`
          );
        });

        this.setState({ isCreatingEvents: false });

        updateSchedule(this.props.scheduleId, {
          eventsCreatedOnce: true,
        })
          .then(() => {
            this.getSchedule();
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  getSchedule() {
    fetchSchedule(this.props.scheduleId)
      .then(schedule => this.setState({ schedule, isLoading: false }))
      .catch(err => console.log(err));
  }

  handleSettingsSave = settings => {
    updateSchedule(this.props.scheduleId, { settings })
      .then(() => {
        this.getSchedule();
        this.setState({
          isSnackbarOpen: true,
          snackbarMessage: 'Settings updated',
          snackbarVariant: 'success',
        });
      })
      .catch(console.error);
  };

  handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ isSnackbarOpen: false });
  };

  handleCreateEntry = async data => {
    try {
      await createScheduleEntries(this.props.scheduleId, {
        entries: [data],
      });
      this.getSchedule();
    } catch (error) {
      this.setState({
        isSnackbarOpen: true,
        snackbarMessage: error.message,
        snackbarVariant: 'error',
      });
    }
  };

  handleDeleteEntry = async entryId => {
    try {
      await deleteScheduleEntry(this.props.scheduleId, entryId);
      this.getSchedule();
    } catch (error) {
      this.setState({
        isSnackbarOpen: true,
        snackbarMessage: error.message,
        snackbarVariant: 'error',
      });
    }
  };

  handleEditClick = async (entryId, data) => {
    try {
      await updateScheduleEntry(this.props.scheduleId, entryId, data);
      this.getSchedule();
    } catch (error) {
      this.setState({
        isSnackbarOpen: true,
        snackbarMessage: error.message,
        snackbarVariant: 'error',
      });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      schedule: {
        schedule,
        totalHours,
        totalWeeklyWage,
        name,
        eventsCreatedOnce,
        settings,
      },
      isLoading,
      isSnackbarOpen,
      snackbarMessage,
      snackbarVariant,
    } = this.state;

    return (
      <Suspense fallback={<Loader loading={isLoading} />}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <IconButton onClick={this.handleBackButtonClick}>
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleCreateEventsClick}
              disabled={this.state.isCreatingEvents}
            >
              {this.state.isCreatingEvents
                ? 'creating events...'
                : 'create events'}
            </Button>
          </Grid>
        </Grid>
        <Paper className={classes.table}>
          <Toolbar className={classes.toolbar}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="h6" id="tableTitle">
                  {name}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <CreateEntryForm onSubmit={this.handleCreateEntry} />
                  </Grid>
                  <Grid item>
                    {settings && (
                      <div>
                        <ScheduleSettings
                          hourlyWage={settings.hourlyWage}
                          onSave={this.handleSettingsSave}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
          <Table>
            <ScheduleHeader />
            {schedule && (
              <TableBody>
                {schedule.map(daySchedule => (
                  <ScheduleItem
                    key={daySchedule.id}
                    daySchedule={daySchedule}
                    onEditClick={data =>
                      this.handleEditClick(daySchedule.id, data)
                    }
                    onDeleteClick={() => this.handleDeleteEntry(daySchedule.id)}
                  />
                ))}
              </TableBody>
            )}
          </Table>
        </Paper>
        <div className={classes.info}>
          <Typography>
            <strong>Total Hours:</strong> {totalHours}
          </Typography>

          <Typography>
            <strong>Total Weekly Wage:</strong>{' '}
            {totalWeeklyWage && totalWeeklyWage.toFixed(2)} EUR
          </Typography>
        </div>
        <MessageSnackbar
          isOpen={isSnackbarOpen}
          onClose={this.handleSnackbarClose}
          message={snackbarMessage}
          variant={snackbarVariant}
        />
      </Suspense>
    );
  }
}

export default withAuth(withStyles(styles)(Schedule));
