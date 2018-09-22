import React, { Component } from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import ScheduleFileUploadForm from '../components/ScheduleFileUploadForm';
import {
  generateScheduleWithFileAndPerson,
  fetchSchedules,
  deleteSchedule,
  updateSchedule,
  fetchHolyTotal,
} from '../api';
import { fetchSettingsForUser } from '../actions/settingsActions';
import IconButton from '@material-ui/core/IconButton';

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
    const { holyTotal } = this.state;

    return (
      <div className="sb-grid sb-padding">
        <div className="sb-col-12">
          <div>
            {this.state.schedules.map(schedule => (
              <div
                key={schedule.id}
                className="sb-tile sb-padding sb-margin-bottom sb-flex sb-justify-content-between sb-align-items-center"
              >
                {this.state.editingScheduleId !== schedule.id ? (
                  <Link to={`/schedules/${schedule.id}`}>{schedule.name}</Link>
                ) : (
                  <div className="sb-flex">
                    <input
                      type="text"
                      className="sb-input sb-margin-right"
                      value={this.state.newScheduleName}
                      onChange={this.handleNewScheduleNameChange}
                    />
                    <button
                      className="sb-btn sb-margin-right"
                      onClick={() =>
                        this.handleUpdateScheduleName(
                          schedule.id,
                          schedule.name
                        )
                      }
                    >
                      update
                    </button>
                    <button
                      className="sb-btn"
                      onClick={this.handleCancelEditClick}
                    >
                      cancel
                    </button>
                  </div>
                )}
                <div className="sb-flex">
                  <button
                    className="sb-btn sb-btn--subtle sb-margin-right"
                    onClick={() =>
                      this.handleScheduleEdit(schedule.id, schedule.name)
                    }
                  >
                    edit
                  </button>
                  <IconButton
                    onClick={() => this.handleScheduleDelete(schedule.id)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="sb-margin-bottom">
            <ScheduleFileUploadForm
              onSubmit={this.handleScheduleFileUploadFormSubmit}
            />
          </div>
          {holyTotal > 0 && (
            <div>
              <strong>Holy total:</strong> {holyTotal.toFixed(2)} EUR
            </div>
          )}
        </div>
      </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
