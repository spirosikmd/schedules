import React, { PureComponent, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { withStyles } from '@material-ui/core/styles';
import { fetchSchedule, updateSchedule } from '../../shared/api';
import withAuth from '../../shared/components/withAuth';
import Loader from '../../shared/components/Loader';
import MessageSnackbar from '../../shared/components/MessageSnackbar';
import CreateEventsDialog from './CreateEventsDialog';
import ScheduleItem from './ScheduleItem';
import ScheduleHeader from './ScheduleHeader';
import ScheduleToolbar from './ScheduleToolbar';
import {
  createEvents,
  createScheduleEntries,
  deleteScheduleEntry,
  updateScheduleEntry,
} from '../api';

const styles = theme => ({
  table: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  info: {
    marginTop: theme.spacing.unit * 2,
  },
  eventsMessage: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class SchedulePage extends PureComponent {
  state = {
    schedule: {},
    isCreatingEvents: false,
    isLoading: false,
    isSnackbarOpen: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
    selected: [],
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    this.getSchedule().then(() => this.setState({ isLoading: false }));
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
    return fetchSchedule(this.props.scheduleId)
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

  handleCreateEventForEntry = () => {
    const { selected, schedule } = this.state;

    const entries = schedule.schedule.filter(entry =>
      selected.includes(entry.id)
    );

    createEvents(entries)
      .then(events => {
        events.forEach(event => {
          console.log(
            `Event created: ${event.created} | ${event.description} | ${
              event.location
            }`
          );
        });

        this.setState({
          selected: [],
          isSnackbarOpen: true,
          snackbarMessage: 'Created events for selected entries',
          snackbarVariant: 'success',
        });
      })
      .catch(console.error);
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
      <Fragment>
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
        {isLoading ? (
          <Loader loading={true} />
        ) : (
          <Paper className={classes.table}>
            <ScheduleToolbar
              name={name}
              numSelected={numSelected}
              hourlyWage={settings && settings.hourlyWage}
              onDeleteEntries={this.handleDeleteEntries}
              onCreateEntry={this.handleCreateEntry}
              onSettingsSave={this.handleSettingsSave}
              onCreateEventForEntry={this.handleCreateEventForEntry}
            />
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
        )}
        {!isLoading && (
          <div className={classes.info}>
            <Typography>
              <strong>Total Hours:</strong> {totalHours}
            </Typography>

            <Typography>
              <strong>Total Weekly Wage:</strong>{' '}
              {totalWeeklyWage && totalWeeklyWage.toFixed(2)} EUR
            </Typography>
          </div>
        )}
        <MessageSnackbar
          isOpen={isSnackbarOpen}
          onClose={this.handleSnackbarClose}
          message={snackbarMessage}
          variant={snackbarVariant}
        />
      </Fragment>
    );
  }
}

export default withAuth(withStyles(styles)(SchedulePage));
