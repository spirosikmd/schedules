import React, { Component } from 'react';
import { GoogleLogout } from 'react-google-login';
import { Link } from '@reach/router';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import {
  generateScheduleWithFileAndPerson,
  fetchSchedules,
  fetchSettings,
} from './api';

class Home extends Component {
  state = {
    schedule: [],
    totalHours: 0,
    totalWeeklyWage: 0,
    settings: {
      person: '',
      hourlyWage: 0,
    },
    selectedScheduleId: '',
    schedules: [],
    isCreatingEvents: false,
  };

  constructor(props) {
    super(props);

    this.handleScheduleFileUploadFormSubmit = this.handleScheduleFileUploadFormSubmit.bind(
      this
    );
    this.handleGoogleLogoutSuccess = this.handleGoogleLogoutSuccess.bind(this);
  }

  componentDidMount() {
    const { email } = this.props.authUser.profileObj;

    fetchSchedules(email)
      .then(schedules => {
        this.setState({ schedules });

        fetchSettings(email)
          .then(settings => {
            this.setState({
              settings: settings || {},
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  handleScheduleFileUploadFormSubmit(file) {
    const { email } = this.props.authUser.profileObj;

    generateScheduleWithFileAndPerson(email, file)
      .then(() => {
        fetchSchedules(email).then(schedules => {
          this.setState({ schedules });
        });
      })
      .catch(err => console.log(err));
  }

  handleGoogleLogoutSuccess() {
    this.props.onGoogleLogoutSuccess();
  }

  render() {
    return (
      <div className="sb-container sb-padding">
        <div className="sb-grid">
          <div className="sb-col-12">
            <ScheduleFileUploadForm
              onSubmit={this.handleScheduleFileUploadFormSubmit}
            />
            <header className="sb-flex sb-justify-content-between sb-margin-bottom">
              <h1>
                Welcome to {this.props.authUser.profileObj.givenName} schedule
              </h1>
              <div>
                <Link className="sb-btn sb-margin-right" to="/settings">
                  Settings
                </Link>
                <GoogleLogout
                  className="sb-btn"
                  buttonText="Logout"
                  onLogoutSuccess={this.handleGoogleLogoutSuccess}
                />
              </div>
            </header>
            {this.state.schedules.length > 0 ? (
              this.state.schedules.map(schedule => (
                <div
                  key={schedule.id}
                  className="sb-tile sb-padding sb-margin-bottom"
                >
                  <Link
                    to={`/schedules/${schedule.id}?person=${
                      this.state.settings.person
                    }&hourlyWage=${this.state.settings.hourlyWage}`}
                  >
                    {schedule.name}
                  </Link>
                </div>
              ))
            ) : (
              <div>Drag and drop a schedule file!</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
