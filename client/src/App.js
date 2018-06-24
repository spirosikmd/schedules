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
    hourlyWage: 9.5,
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

  render() {
    return (
      <div className="sb-container">
        <div className="sb-grid">
          <div className="sb-col-12">
            <header>
              <h1>Welcome to {this.state.person}'s Schedule</h1>
            </header>
            <div>
              <ScheduleFileUploadForm
                onSubmit={this.handleScheduleFileUploadFormSubmit}
              />
              <RefreshForm
                hourlyWage={this.state.hourlyWage}
                onHourlyWageChange={this.handleHourlyWageChange}
                onSubmit={this.handleRefreshFormSubmit}
              />
              <Schedule
                schedule={this.state.response.schedule}
                totalHours={this.state.response.totalHours}
                totalWeeklyWage={this.state.response.totalWeeklyWage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
