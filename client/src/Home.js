import React, { Component } from 'react';
import { GoogleLogout } from 'react-google-login';
import { Link } from '@reach/router';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import {
  generateScheduleWithFileAndPerson,
  fetchSchedules,
  fetchSettings,
  deleteSchedule,
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

  handleScheduleDelete(scheduleId) {
    const { email } = this.props.authUser.profileObj;
    deleteSchedule(email, scheduleId)
      .then(() => {
        fetchSchedules(email).then(schedules => {
          this.setState({ schedules });
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="sb-container sb-padding">
        <div className="sb-grid">
          <div className="sb-col-12">
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
            <div>
              <h2 className="sb-margin-bottom">Select a schedule</h2>
              {this.state.schedules.map(schedule => (
                <div
                  key={schedule.id}
                  className="sb-tile sb-padding sb-margin-bottom sb-flex sb-justify-content-between sb-align-items-center"
                >
                  <Link
                    to={`/schedules/${schedule.id}?person=${
                      this.state.settings.person
                    }&hourlyWage=${this.state.settings.hourlyWage}`}
                  >
                    {schedule.name}
                  </Link>
                  <button
                    className="sb-btn"
                    onClick={() => this.handleScheduleDelete(schedule.id)}
                  >
                    <svg className="sb-icon" viewBox="0 0 16 16">
                      <path d="M6.07369,13.800506 L5.5067,4.501887 C5.49899,4.287778 5.32027,4.12099 5.10764,4.12836 C4.89502,4.136506 4.72901,4.316481 4.73671,4.53059 L5.30409,13.829209 C5.31179,14.043318 5.49052,14.210493 5.70314,14.202736 C5.91576,14.19459 6.08139,14.015003 6.07369,13.800506 Z M12.23704,14.507579 C12.18504,14.883573 11.89191,15.220363 11.46667,15.220363 L4.53333,15.220363 C4.1077,15.220363 3.82151,14.887493 3.76296,14.507579 L2.99259,2.909091 L13.00741,2.909091 L12.23704,14.507579 Z M6.07407,2.327273 L6.07407,0.776145 L9.92593,0.776145 L9.92593,2.327273 L6.07407,2.327273 Z M10.6963,2.181818 L10.6963,0.727636 C10.6963,0.325818 10.35117,0 9.92593,0 L6.07407,0 C5.64844,0 5.3037,0.325818 5.3037,0.727636 L5.3037,2.181818 L0.38519,2.181818 C0.17256,2.181818 0,2.344727 0,2.545818 C0,2.746545 0.17256,2.909091 0.38519,2.909091 L2.22222,2.909091 L2.99259,14.545455 C3.11662,15.341455 3.68246,16 4.53333,16 L11.46667,16 C12.31754,16 12.86258,15.333455 13.00741,14.545455 L13.77778,2.909091 L15.61481,2.909091 C15.82744,2.909091 16,2.746545 16,2.545818 C16,2.344727 15.82744,2.181818 15.61481,2.181818 L10.6963,2.181818 Z M10.69707,13.829208 L11.25559,4.53059 C11.26329,4.316481 11.09727,4.136505 10.88465,4.12836 C10.67203,4.12099 10.4933,4.288166 10.48599,4.502275 L9.92708,13.801281 C9.91938,14.01539 10.08578,14.194978 10.29801,14.202735 C10.51102,14.210881 10.68936,14.043317 10.69707,13.829208 Z M8.38519,13.814157 L8.38519,4.505066 C8.38519,4.290569 8.21262,4.117188 8,4.117188 C7.78738,4.117188 7.61481,4.290569 7.61481,4.505066 L7.61481,13.814157 C7.61481,14.028654 7.78738,14.202036 8,14.202036 C8.21262,14.202036 8.38519,14.028654 8.38519,13.814157 Z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <ScheduleFileUploadForm
              onSubmit={this.handleScheduleFileUploadFormSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
