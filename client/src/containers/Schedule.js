import React, { PureComponent, Fragment } from 'react';
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
import ScheduleItem from '../components/ScheduleItem';
import ScheduleHeader from '../components/ScheduleHeader';
import { fetchScheduleForPerson, createEvents, updateSchedule } from '../api';
import { fetchSettingsForUser } from '../actions/settingsActions';

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
  };

  constructor(props) {
    super(props);

    this.handleCreateEventsClick = this.handleCreateEventsClick.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchSettingsForUser(this.props.token).then(() => {
      this.getSchedule();
    });
  }

  handleBackButtonClick(event) {
    event.preventDefault();
    this.props.navigate('/');
  }

  handleCreateEventsClick() {
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

        const { token } = this.props;

        updateSchedule(token, this.props.scheduleId, {
          eventsCreatedOnce: true,
        })
          .then(() => {
            this.getSchedule();
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  getSchedule() {
    const { person, hourlyWage } = this.props.settings;
    const { token } = this.props;

    fetchScheduleForPerson(token, this.props.scheduleId, person, hourlyWage)
      .then(schedule => this.setState({ schedule }))
      .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    const {
      schedule,
      totalHours,
      totalWeeklyWage,
      name,
      eventsCreatedOnce,
    } = this.state.schedule;

    return (
      <Fragment>
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
                    <Typography variant="headline" component="h3">
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
          <Table>
            <ScheduleHeader />
            <TableBody>
              {schedule &&
                schedule.map(daySchedule => (
                  <ScheduleItem
                    key={daySchedule.date}
                    daySchedule={daySchedule}
                  />
                ))}
            </TableBody>
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
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
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
  )(Schedule)
);
