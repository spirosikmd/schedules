import React, { PureComponent, Suspense, lazy } from 'react';
import { connect } from 'react-redux';
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
import { fetchSettingsForUser } from '../actions/settingsActions';
import withAuth from '../components/withAuth';
import Loader from '../components/Loader';
import CreateEntryForm from '../components/CreateEntryForm';

const ScheduleItem = lazy(() => import('../components/ScheduleItem'));
const ScheduleHeader = lazy(() => import('../components/ScheduleHeader'));
const ScheduleSettings = lazy(() => import('../components/ScheduleSettings'));
const MessageSnackbar = lazy(() => import('../components/MessageSnackbar'));

const styles = theme => ({
  table: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  info: {
    marginTop: theme.spacing.unit,
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
    this.props.fetchSettingsForUser().then(() => {
      this.getSchedule();
    });
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
            <Grid container alignItems="center">
              <Grid item>
                <IconButton onClick={this.handleBackButtonClick}>
                  <ArrowBack />
                </IconButton>
              </Grid>
              <Grid item>
                <Grid container alignItems="baseline" spacing={8}>
                  <Grid item>
                    <Typography variant="h5" component="h3">
                      {name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {eventsCreatedOnce && (
                      <Typography>
                        You have created events for this schedule already!
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" spacing={8}>
              <Grid item>
                <CreateEntryForm onSubmit={this.handleCreateEntry} />
              </Grid>
              <Grid item>
                {settings && (
                  <ScheduleSettings
                    hourlyWage={settings.hourlyWage}
                    onSave={this.handleSettingsSave}
                  />
                )}
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
          </Grid>
        </Grid>
        <Paper className={classes.table}>
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

const mapStateToProps = state => ({
  settings: state.settingsReducer.settings,
});

const mapDispatchToProps = dispatch => ({
  fetchSettingsForUser: () => dispatch(fetchSettingsForUser()),
});

export default withAuth(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Schedule)
  )
);
