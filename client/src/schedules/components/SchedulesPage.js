import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import withAuth from '../../shared/components/withAuth';
import Loader from '../../shared/components/Loader';
import MessageSnackbar from '../../shared/components/MessageSnackbar';
import { updateSchedule } from '../../shared/api';
import { deleteSchedule } from '../api';
import { fetchSchedules } from '../../shared/api';
import { setSchedules } from '../../shared/actions';
import ScheduleListItem from './ScheduleListItem';

class SchedulesPage extends Component {
  state = {
    editingScheduleId: '',
    newScheduleName: '',
    isLoadingSchedules: false,
    isSnackbarOpen: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
  };

  componentDidMount() {
    this.setState({ isLoadingSchedules: true });

    fetchSchedules()
      .then(schedules => {
        this.props.setSchedules(schedules);
        this.setState({ isLoadingSchedules: false });
      })
      .catch(err => console.log(err));
  }

  handleScheduleDelete = scheduleId => {
    deleteSchedule(scheduleId)
      .then(() => {
        fetchSchedules().then(schedules => {
          this.props.setSchedules(schedules);
        });

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
        this.props.setSchedules(schedules);
      });
    });
  };

  handleNewScheduleNameChange = event => {
    const value = event.target.value;
    this.setState({ newScheduleName: value });
  };

  handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ isSnackbarOpen: false });
  };

  render() {
    const { schedules } = this.props;
    const {
      isLoadingSchedules,
      isSnackbarOpen,
      snackbarMessage,
      snackbarVariant,
    } = this.state;

    return (
      <Fragment>
        <Grid container spacing={16}>
          {isLoadingSchedules ? (
            <Loader loading={true} />
          ) : (
            schedules.map(schedule => (
              <ScheduleListItem
                key={schedule.id}
                schedule={schedule}
                newScheduleName={this.state.newScheduleName}
                editingScheduleId={this.state.editingScheduleId}
                onNewScheduleNameChange={this.handleNewScheduleNameChange}
                onCancelEditClick={this.handleCancelEditClick}
                onUpdateScheduleName={() =>
                  this.handleUpdateScheduleName(schedule.id, schedule.name)
                }
                onScheduleEdit={() =>
                  this.handleScheduleEdit(schedule.id, schedule.name)
                }
                onScheduleDelete={() => this.handleScheduleDelete(schedule.id)}
              />
            ))
          )}
        </Grid>
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

SchedulesPage.propTypes = {
  schedules: PropTypes.array.isRequired,
  setSchedules: PropTypes.func.isRequired,
};

const mapStateToProps = ({ schedulesReducer }) => ({
  schedules: schedulesReducer.schedules,
});

const mapDispatchToProps = {
  setSchedules,
};

export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SchedulesPage)
);
