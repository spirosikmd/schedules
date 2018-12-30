import React, { PureComponent, Suspense, lazy } from 'react';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
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
import ResponsiveConfirmDeleteDialog from './ResponsiveConfirmDeleteDialog';
import CreateEventsDialog from './CreateEventsDialog';

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
  eventsMessage: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
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
    selected: [],
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

  handleDeleteEntries = async () => {
    try {
      await Promise.all(
        this.state.selected.map(entryId =>
          deleteScheduleEntry(this.props.scheduleId, entryId)
        )
      );
      this.getSchedule();
      this.setState({ selected: [] });
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

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: state.schedule.schedule.map(daySchedule => daySchedule.id),
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  isScheduleItemSelected = id => {
    return this.state.selected.indexOf(id) !== -1;
  };

  handleScheduleItemSelect = id => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
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
      selected,
      isCreatingEvents,
    } = this.state;

    const numSelected = selected.length;

    return (
      <Suspense fallback={<Loader loading={isLoading} />}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <IconButton onClick={this.handleBackButtonClick} aria-label="Back">
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid item>
            <CreateEventsDialog
              onCreateEventsClick={this.handleCreateEventsClick}
              eventsCreatedOnce={eventsCreatedOnce}
              isCreatingEvents={isCreatingEvents}
            />
          </Grid>
        </Grid>
        <Paper className={classes.table}>
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
                    <ResponsiveConfirmDeleteDialog
                      title="Delete selected entries?"
                      content="Are you sure you want to delete the selected entries?"
                      onDeleteClick={this.handleDeleteEntries}
                    />
                  ) : (
                    <>
                      <Grid item>
                        <CreateEntryForm onSubmit={this.handleCreateEntry} />
                      </Grid>
                      {settings && (
                        <Grid item>
                          <ScheduleSettings
                            hourlyWage={settings.hourlyWage}
                            onSave={this.handleSettingsSave}
                          />
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
          {schedule && (
            <Table>
              <ScheduleHeader
                numSelected={numSelected}
                onSelectAllClick={this.handleSelectAllClick}
                rowCount={schedule.length}
              />
              <TableBody>
                {schedule.map(daySchedule => (
                  <ScheduleItem
                    key={daySchedule.id}
                    daySchedule={daySchedule}
                    onEditClick={data =>
                      this.handleEditClick(daySchedule.id, data)
                    }
                    isSelected={this.isScheduleItemSelected(daySchedule.id)}
                    onSelect={() =>
                      this.handleScheduleItemSelect(daySchedule.id)
                    }
                  />
                ))}
              </TableBody>
            </Table>
          )}
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
