import React, { Component } from 'react';
import Schedule from './Schedule';
import RefreshForm from './RefreshForm';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import {
  fetchScheduleForPerson,
  generateScheduleWithFileAndPerson,
} from './api';

class App extends Component {
  state = {
    response: {
      schedule: [],
      totalHours: 0,
    },
    person: 'Jenny',
    hourlyWage: 8.5,
  };

  componentDidMount() {
    fetchScheduleForPerson(this.state.person, this.state.hourlyWage)
      .then(response => this.setState({ response }))
      .catch(err => console.log(err));
  }

  handleScheduleFileUploadFormSubmit = async file => {
    generateScheduleWithFileAndPerson(file)
      .then(() => {
        fetchScheduleForPerson(this.state.person, this.state.hourlyWage).then(
          response => this.setState({ response })
        );
      })
      .catch(err => console.log(err));
  };

  handleHourlyWageChange = hourlyWage => {
    this.setState({ hourlyWage });
  };

  handleRefreshFormSubmit = async () => {
    fetchScheduleForPerson(this.state.person, this.state.hourlyWage)
      .then(response => this.setState({ response }))
      .catch(err => console.log(err));
  };

  handleCreateEventsClick = () => {
    alert('create events');
  };

  render() {
    return (
      <div className="sb-container sb-padding">
        <div className="sb-grid">
          <div className="sb-col-12">
            <ScheduleFileUploadForm
              onSubmit={this.handleScheduleFileUploadFormSubmit}
            />
            <header className="sb-margin-bottom">
              <h1>Welcome to {this.state.person}'s Schedule</h1>
            </header>
            <div className="sb-flex sb-padding-bottom sb-justify-content-between">
              <RefreshForm
                hourlyWage={this.state.hourlyWage}
                onHourlyWageChange={this.handleHourlyWageChange}
                onSubmit={this.handleRefreshFormSubmit}
              />
              <div>
                <button
                  className="sb-btn"
                  onClick={this.handleCreateEventsClick}
                >
                  create events
                </button>
              </div>
            </div>
            <Schedule
              schedule={this.state.response.schedule}
              totalHours={this.state.response.totalHours}
              totalWeeklyWage={this.state.response.totalWeeklyWage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
