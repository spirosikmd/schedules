import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import NewSchedule from './NewSchedule';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { setSchedules } from '../../shared/actions';
import MessageSnackbar from '../../shared/components/MessageSnackbar';
import {
  generateScheduleWithFileAndPerson,
  createSchedule,
  fetchHolyTotal,
  fetchBestSchedule,
  fetchHighestLocation,
  fetchNextWorkingDate,
} from '../api';
import Info from './Info';

const styles = theme => ({
  actions: {
    marginBottom: theme.spacing(2),
  },
});

class HomePage extends Component {
  state = {
    holyTotal: 0,
    isSnackbarOpen: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
    nextWorkingDate: undefined,
    highestLocation: undefined,
    bestSchedule: undefined,
  };

  componentDidMount() {
    fetchHolyTotal()
      .then(response => this.setState({ holyTotal: response.data.holyTotal }))
      .catch(error => {
        this.setState({
          isSnackbarOpen: true,
          snackbarMessage: error.message,
          snackbarVariant: 'error',
        });
      });

    fetchNextWorkingDate()
      .then(response =>
        this.setState({ nextWorkingDate: response.data.nextWorkingDate })
      )
      .catch(error => {
        this.setState({
          isSnackbarOpen: true,
          snackbarMessage: error.message,
          snackbarVariant: 'error',
        });
      });

    fetchBestSchedule()
      .then(response =>
        this.setState({ bestSchedule: response.data.bestSchedule })
      )
      .catch(error => {
        this.setState({
          isSnackbarOpen: true,
          snackbarMessage: error.message,
          snackbarVariant: 'error',
        });
      });

    fetchHighestLocation()
      .then(response =>
        this.setState({ highestLocation: response.data.highestLocation })
      )
      .catch(error => {
        this.setState({
          isSnackbarOpen: true,
          snackbarMessage: error.message,
          snackbarVariant: 'error',
        });
      });
  }

  handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ isSnackbarOpen: false });
  };

  handleScheduleFileUploadFormSubmit = (file, hourlyWage, person) => {
    generateScheduleWithFileAndPerson(file, hourlyWage, person)
      .then(schedule => {
        this.props.navigate(`/schedules/${schedule._id}`);
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
    createSchedule(data).then(schedule => {
      this.props.navigate(`/schedules/${schedule._id}`);
    });
  };

  render() {
    const { classes } = this.props;
    const {
      holyTotal,
      nextWorkingDate,
      bestSchedule,
      highestLocation,
      isSnackbarOpen,
      snackbarMessage,
      snackbarVariant,
    } = this.state;

    return (
      <Fragment>
        <Grid
          container
          spacing={1}
          className={classes.actions}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <ScheduleFileUploadForm
              onSubmit={this.handleScheduleFileUploadFormSubmit}
            />
          </Grid>
          <Grid item>
            <NewSchedule onCreate={this.handleCreateSchedule} />
          </Grid>
        </Grid>
        <Info
          holyTotal={holyTotal}
          nextWorkingDate={nextWorkingDate}
          bestSchedule={bestSchedule}
          highestLocation={highestLocation}
        />
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

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  schedules: PropTypes.array.isRequired,
  setSchedules: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
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
