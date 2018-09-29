import React, { Component, Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
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

const styles = theme => ({
  item: {
    padding: theme.spacing.unit,
  },
  actions: {
    textAlign: 'right',
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
    const { token } = this.props;

    fetchSchedules(token)
      .then(schedules => {
        this.setState({ schedules });

        this.props
          .fetchSettingsForUser(token)
          .then(() => {
            fetchHolyTotal(
              token,
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
    const { token } = this.props;

    generateScheduleWithFileAndPerson(token, file)
      .then(() => {
        fetchSchedules(token).then(schedules => {
          this.setState({ schedules });
        });

        const { settings } = this.props;

        fetchHolyTotal(token, settings.person, settings.hourlyWage).then(
          response => this.setState({ holyTotal: response.data.holyTotal })
        );
      })
      .catch(err => console.log(err));
  }

  handleScheduleDelete(scheduleId) {
    const { token } = this.props;

    deleteSchedule(token, scheduleId)
      .then(() => {
        fetchSchedules(token).then(schedules => {
          this.setState({ schedules });
        });

        const { settings } = this.props;

        fetchHolyTotal(token, settings.person, settings.hourlyWage).then(
          response => this.setState({ holyTotal: response.data.holyTotal })
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

    const { token } = this.props;

    updateSchedule(token, scheduleId, {
      name: parsedNewScheduleName,
    }).then(() => {
      this.setState({ editingScheduleId: '' });

      fetchSchedules(token).then(schedules => {
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
                      <Grid container>
                        <TextField
                          id="newScheduleName"
                          value={this.state.newScheduleName}
                          onChange={this.handleNewScheduleNameChange}
                        />
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
                    )}
                  </Grid>
                  <Grid item xs={4} className={classes.actions}>
                    <Button
                      color="secondary"
                      onClick={() =>
                        this.handleScheduleEdit(schedule.id, schedule.name)
                      }
                    >
                      edit name
                    </Button>
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
        <div>
          <ScheduleFileUploadForm
            onSubmit={this.handleScheduleFileUploadFormSubmit}
          />
        </div>
        {holyTotal > 0 && (
          <Typography variant="body1">
            <strong>Holy total:</strong> {holyTotal.toFixed(2)} EUR
          </Typography>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
  token: state.authReducer.token,
  settings: state.settingsReducer.settings,
});

const mapDispatchToProps = dispatch => ({
  fetchSettingsForUser: token => dispatch(fetchSettingsForUser(token)),
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
