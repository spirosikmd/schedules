import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import NewSchedule from './NewSchedule';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  generateScheduleWithFileAndPerson,
  createSchedule,
  fetchHolyTotal,
} from '../api';
import { fetchSchedules } from '../../shared/api';
import { setSchedules } from '../../shared/actions';

const styles = theme => ({
  actions: {
    marginBottom: theme.spacing.unit,
  },
  info: {
    marginTop: theme.spacing.unit * 2,
  },
});

class HomePage extends Component {
  state = {
    holyTotal: 0,
  };

  componentDidMount() {
    fetchHolyTotal()
      .then(response => this.setState({ holyTotal: response.data.holyTotal }))
      .catch(err => console.log(err));
  }

  handleScheduleFileUploadFormSubmit = (file, hourlyWage, person) => {
    generateScheduleWithFileAndPerson(file, hourlyWage, person)
      .then(() => {
        fetchSchedules().then(schedules => {
          this.props.setSchedules(schedules);
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

  handleCreateSchedule = data => {
    createSchedule(data).then(() => {
      fetchSchedules().then(schedules => {
        this.props.setSchedules(schedules);
      });
    });
  };

  render() {
    const { classes } = this.props;
    const { holyTotal } = this.state;

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
        {holyTotal > 0 && (
          <Typography className={classes.info}>
            <strong>Holy total:</strong> {holyTotal.toFixed(2)} EUR
          </Typography>
        )}
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  schedules: PropTypes.array.isRequired,
  setSchedules: PropTypes.func.isRequired,
};

const mapStateToProps = ({ schedulesReducer }) => ({
  schedules: schedulesReducer.schedules,
});

const mapDispatchToProps = {
  setSchedules,
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
