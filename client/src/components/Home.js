import React, { Component, Fragment } from 'react';
import { Link } from '@reach/router';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import {
  generateScheduleWithFileAndPerson,
  fetchSchedules,
  deleteSchedule,
  updateSchedule,
  fetchHolyTotal,
  createSchedule,
} from '../api';
import withAuth from './withAuth';
import Loader from './Loader';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import ResponsiveConfirmDeleteDialog from './ResponsiveConfirmDeleteDialog';
import NewSchedule from './NewSchedule';
import MessageSnackbar from './MessageSnackbar';

const styles = theme => ({
  item: {
    padding: theme.spacing.unit,
  },
  actions: {
    marginBottom: theme.spacing.unit,
  },
  editContainer: {
    paddingLeft: theme.spacing.unit * 2,
  },
  scheduleLink: {
    paddingLeft: theme.spacing.unit,
  },
  info: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Home extends Component {
  state = {
    schedule: [],
    totalHours: 0,
    totalWeeklyWage: 0,
    selectedScheduleId: '',
    schedules: [],
    isCreatingEvents: false,
    editingScheduleId: '',
    newScheduleName: '',
    holyTotal: 0,
    isDrawerOpen: false,
    isLoadingSchedules: false,
    isSnackbarOpen: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
  };

  componentDidMount() {
    this.setState({ isLoadingSchedules: true });

    fetchSchedules()
      .then(schedules => {
        this.setState({ schedules, isLoadingSchedules: false });
      })
      .catch(err => console.log(err));

    fetchHolyTotal()
      .then(response => this.setState({ holyTotal: response.data.holyTotal }))
      .catch(err => console.log(err));
  }

  handleScheduleFileUploadFormSubmit = (file, hourlyWage, person) => {
    generateScheduleWithFileAndPerson(file, hourlyWage, person)
      .then(() => {
        fetchSchedules().then(schedules => {
          this.setState({ schedules });
        });

        fetchHolyTotal().then(response =>
          this.setState({ holyTotal: response.data.holyTotal })
        );
      })
      .catch(error => {
        this.setState({
          isSnackbarOpen: true,
          snackbarMessage: error.message,
          snackbarVariant: 'error',
        });
      });
  };

  handleScheduleDelete = scheduleId => {
    deleteSchedule(scheduleId)
      .then(() => {
        fetchSchedules().then(schedules => {
          this.setState({ schedules });
        });

        fetchHolyTotal().then(response =>
          this.setState({ holyTotal: response.data.holyTotal })
        );

        this.setState({
          isSnackbarOpen: true,
          snackbarMessage: 'Schedule deleted',
          snackbarVariant: 'success',
        });
      })
      .catch(err => console.log(err));
  };

  handleScheduleEdit = (scheduleId, newScheduleName) => {
    this.setState({ editingScheduleId: scheduleId, newScheduleName });
  };

  handleCancelEditClick = () => {
    this.setState({ editingScheduleId: '', newScheduleName: '' });
  };

  handleUpdateScheduleName = (scheduleId, scheduleName) => {
    const { newScheduleName } = this.state;

    const parsedNewScheduleName = newScheduleName.trim();

    if (!parsedNewScheduleName || scheduleName === parsedNewScheduleName) {
      this.setState({ editingScheduleId: '' });
      return;
    }

    updateSchedule(scheduleId, {
      name: parsedNewScheduleName,
    }).then(() => {
      this.setState({ editingScheduleId: '' });

      fetchSchedules().then(schedules => {
        this.setState({ schedules });
      });
    });
  };

  handleNewScheduleNameChange = event => {
    const value = event.target.value;
    this.setState({ newScheduleName: value });
  };

  handleCreateSchedule = data => {
    createSchedule(data).then(() => {
      fetchSchedules().then(schedules => {
        this.setState({ schedules });
      });
    });
  };

  handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ isSnackbarOpen: false });
  };

  render() {
    const { classes } = this.props;
    const {
      holyTotal,
      schedules,
      isLoadingSchedules,
      isSnackbarOpen,
      snackbarMessage,
      snackbarVariant,
    } = this.state;

    return (
      <Fragment>
        <Grid container spacing={8} className={classes.actions}>
          <Grid item>
            <ScheduleFileUploadForm
              onSubmit={this.handleScheduleFileUploadFormSubmit}
            />
          </Grid>
          <Grid item>
            <NewSchedule onCreate={this.handleCreateSchedule} />
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          {isLoadingSchedules ? (
            <Loader loading={true} />
          ) : (
            schedules.map(schedule => (
              <Grid item xs={12} key={schedule.id}>
                <Paper className={classes.item}>
                  <Grid container alignItems="center">
                    <Grid item xs={8}>
                      {this.state.editingScheduleId !== schedule.id ? (
                        <Typography className={classes.scheduleLink}>
                          <Link to={`/schedules/${schedule.id}`}>
                            {schedule.name}
                          </Link>
                        </Typography>
                      ) : (
                        <Grid
                          container
                          className={classes.editContainer}
                          spacing={8}
                        >
                          <Grid item>
                            <TextField
                              id="newScheduleName"
                              value={this.state.newScheduleName}
                              onChange={this.handleNewScheduleNameChange}
                              autoFocus
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              color="primary"
                              onClick={() =>
                                this.handleUpdateScheduleName(
                                  schedule.id,
                                  schedule.name
                                )
                              }
                            >
                              update
                            </Button>
                            <Button
                              color="secondary"
                              onClick={this.handleCancelEditClick}
                            >
                              cancel
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <Grid container justify="flex-end">
                        <IconButton
                          onClick={() =>
                            this.handleScheduleEdit(schedule.id, schedule.name)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <ResponsiveConfirmDeleteDialog
                          title="Delete schedule?"
                          content="All the schedule data will be removed permanently and you won't be
                      able to retrieve them again."
                          onDeleteClick={() =>
                            this.handleScheduleDelete(schedule.id)
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
        {holyTotal > 0 && (
          <Typography className={classes.info}>
            <strong>Holy total:</strong> {holyTotal.toFixed(2)} EUR
          </Typography>
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

export default withAuth(withStyles(styles)(Home));
