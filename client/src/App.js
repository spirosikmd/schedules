import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Schedule from './Schedule';
import RefreshForm from './RefreshForm';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import {
  fetchScheduleForPerson,
  generateScheduleWithFileAndPerson,
  fetchSchedules,
  fetchSelectedScheduleId,
  fetchSettings,
  createEvents,
  updateSchedule,
} from './api';

class App extends Component {
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
    authUser: null,
    error: {
      errorCode: '',
      details: '',
    },
    isCreatingEvents: false,
  };

  componentDidMount() {
    fetchSchedules()
      .then(schedules => {
        this.setState({ schedules });

        Promise.all([fetchSelectedScheduleId(), fetchSettings()])
          .then(([selectedScheduleId, settings]) => {
            if (!selectedScheduleId) {
              return;
            }

            this.setState({
              selectedScheduleId: selectedScheduleId,
              settings,
            });

            fetchScheduleForPerson(
              selectedScheduleId,
              settings.person,
              settings.hourlyWage
            )
              .then(response =>
                this.setState({
                  schedule: response.schedule,
                  totalHours: response.totalHours,
                  totalWeeklyWage: response.totalWeeklyWage,
                })
              )
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  handleScheduleFileUploadFormSubmit = async file => {
    generateScheduleWithFileAndPerson(file)
      .then(() => {
        fetchSchedules().then(schedules => {
          const lastSchedule = schedules[schedules.length - 1];
          this.setState({ schedules, selectedScheduleId: lastSchedule.id });

          fetchScheduleForPerson(
            lastSchedule.id,
            this.state.settings.person,
            this.state.settings.hourlyWage
          ).then(response =>
            this.setState({
              schedule: response.schedule,
              totalHours: response.totalHours,
              totalWeeklyWage: response.totalWeeklyWage,
            })
          );
        });
      })
      .catch(err => console.log(err));
  };

  handleHourlyWageChange = hourlyWage => {
    const settings = {
      ...this.state.settings,
      ...{
        hourlyWage,
      },
    };
    this.setState({ settings });
  };

  handlePersonChange = person => {
    const settings = {
      ...this.state.settings,
      ...{
        person,
      },
    };
    this.setState({ settings });
  };

  handleRefreshFormSubmit = async () => {
    fetchScheduleForPerson(
      this.state.selectedScheduleId,
      this.state.settings.person,
      this.state.settings.hourlyWage
    )
      .then(response =>
        this.setState({
          schedule: response.schedule,
          totalHours: response.totalHours,
          totalWeeklyWage: response.totalWeeklyWage,
        })
      )
      .catch(err => console.log(err));
  };

  handleCreateEventsClick = () => {
    this.setState({ isCreatingEvents: true });

    createEvents(this.state.schedule)
      .then(events => {
        events.forEach(event => {
          console.log(
            `Event created: ${event.created} | ${event.description} | ${
              event.location
            }`
          );
        });

        this.setState({ isCreatingEvents: false });

        updateSchedule(this.state.selectedScheduleId, {
          eventsCreatedOnce: true,
        })
          .then(updatedSchedule => {
            console.log(updatedSchedule);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  handleSelectedScheduleChange = selectedScheduleId => {
    this.setState({ selectedScheduleId });
  };

  handleGoogleLoginSuccess = authUser => {
    this.setState({ authUser });
  };

  handleGoogleLoginFailure = ({ error, details }) => {
    this.setState({ error: { errorCode: error, details } });
  };

  handleGoogleLogoutSuccess = () => {
    this.setState({ authUser: null });
  };

  render() {
    if (this.state.authUser === null) {
      return (
        <div className="sb-container sb-padding">
          <GoogleLogin
            className="sb-btn sb-btn--primary"
            clientId="1052222050887-labkfk5agrcfn4dbfaf0qitjq635s5nv.apps.googleusercontent.com"
            buttonText="Login"
            scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.me"
            isSignedIn
            onSuccess={this.handleGoogleLoginSuccess}
            onFailure={this.handleGoogleLoginFailure}
          />
        </div>
      );
    }

    return (
      <div className="sb-container sb-padding">
        <div className="sb-grid">
          <div className="sb-col-12">
            <ScheduleFileUploadForm
              onSubmit={this.handleScheduleFileUploadFormSubmit}
            />
            <header className="sb-flex sb-justify-content-between sb-margin-bottom">
              <h1>
                Welcome to {this.state.authUser.profileObj.givenName} schedule
              </h1>
              <GoogleLogout
                className="sb-btn"
                buttonText="Logout"
                onLogoutSuccess={this.handleGoogleLogoutSuccess}
              />
            </header>
            <div className="sb-flex sb-padding-bottom sb-justify-content-between">
              <RefreshForm
                person={this.state.settings.person}
                hourlyWage={this.state.settings.hourlyWage}
                schedules={this.state.schedules}
                selectedScheduleId={this.state.selectedScheduleId}
                onHourlyWageChange={this.handleHourlyWageChange}
                onPersonChange={this.handlePersonChange}
                onSelectedScheduleChange={this.handleSelectedScheduleChange}
                onSubmit={this.handleRefreshFormSubmit}
              />
              <button
                className="sb-btn sb-btn--primary"
                onClick={this.handleCreateEventsClick}
                disabled={this.state.isCreatingEvents}
              >
                {this.state.isCreatingEvents
                  ? 'creating events...'
                  : 'create events'}
              </button>
            </div>
            <Schedule
              schedule={this.state.schedule}
              totalHours={this.state.totalHours}
              totalWeeklyWage={this.state.totalWeeklyWage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
