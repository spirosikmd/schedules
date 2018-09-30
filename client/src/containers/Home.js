import React, { Component, Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import ScheduleFileUploadForm from '../components/ScheduleFileUploadForm';
import {
  generateScheduleWithFileAndPerson,
  fetchSchedules,
  deleteSchedule,
  updateSchedule,
  fetchHolyTotal,
} from '../api';
import { fetchSettingsForUser } from '../actions/settingsActions';
import withAuth from '../components/withAuth';

const styles = theme => ({
  item: {
    padding: theme.spacing.unit,
  },
  actions: {
    textAlign: 'right',
  },
  editActions: {
    marginLeft: theme.spacing.unit,
  },
  editContainer: {
    paddingLeft: theme.spacing.unit * 2,
  },
  scheduleFileUploadForm: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
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
  };

  constructor(props) {
    super(props);

    this.handleScheduleFileUploadFormSubmit = this.handleScheduleFileUploadFormSubmit.bind(
      this
    );
    this.handleCancelEditClick = this.handleCancelEditClick.bind(this);
    this.handleNewScheduleNameChange = this.handleNewScheduleNameChange.bind(
      this
    );
  }

  componentDidMount() {
    fetchSchedules()
      .then(schedules => {
        this.setState({ schedules });

        this.props
          .fetchSettingsForUser()
          .then(() => {
            fetchHolyTotal(
              this.props.settings.person,
              this.props.settings.hourlyWage
            ).then(response =>
              this.setState({ holyTotal: response.data.holyTotal })
            );
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  handleScheduleFileUploadFormSubmit(file) {
    generateScheduleWithFileAndPerson(file)
      .then(() => {
        fetchSchedules().then(schedules => {
          this.setState({ schedules });
        });

        const { settings } = this.props;

        fetchHolyTotal(settings.person, settings.hourlyWage).then(response =>
          this.setState({ holyTotal: response.data.holyTotal })
        );
      })
      .catch(err => console.log(err));
  }

  handleScheduleDelete(scheduleId) {
    deleteSchedule(scheduleId)
      .then(() => {
        fetchSchedules().then(schedules => {
          this.setState({ schedules });
        });

        const { settings } = this.props;

        fetchHolyTotal(settings.person, settings.hourlyWage).then(response =>
          this.setState({ holyTotal: response.data.holyTotal })
        );
      })
      .catch(err => console.log(err));
  }

  handleScheduleEdit(scheduleId, newScheduleName) {
    this.setState({ editingScheduleId: scheduleId, newScheduleName });
  }

  handleCancelEditClick() {
    this.setState({ editingScheduleId: '', newScheduleName: '' });
  }

  handleUpdateScheduleName(scheduleId, scheduleName) {
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
  }

  handleNewScheduleNameChange(event) {
    const value = event.target.value;
    this.setState({ newScheduleName: value });
  }

  render() {
    const { classes } = this.props;
    const { holyTotal } = this.state;

    return (
      <Fragment>
        <Grid container spacing={8}>
          {this.state.schedules.map(schedule => (
            <Grid item xs={12} key={schedule.id}>
              <Paper className={classes.item}>
                <Grid container alignItems="center">
                  <Grid item xs={8}>
                    {this.state.editingScheduleId !== schedule.id ? (
                      <Button component={Link} to={`/schedules/${schedule.id}`}>
                        {schedule.name}
                      </Button>
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
                  <Grid item xs={4} className={classes.actions}>
                    <IconButton
                      onClick={() =>
                        this.handleScheduleEdit(schedule.id, schedule.name)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => this.handleScheduleDelete(schedule.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <div className={classes.scheduleFileUploadForm}>
          <ScheduleFileUploadForm
            onSubmit={this.handleScheduleFileUploadFormSubmit}
          />
        </div>
        {holyTotal > 0 && (
          <Typography>
            <strong>Holy total:</strong> {holyTotal.toFixed(2)} EUR
          </Typography>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
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
    )(Home)
  )
);
