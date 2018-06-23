import React, { Component } from 'react';
import Schedule from './Schedule';
import RefreshForm from './RefreshForm';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';

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
    this.fetchScheduleForPerson(this.state.person, this.state.hourlyWage)
      .then(response => this.setState({ response }))
      .catch(err => console.log(err));
  }

  fetchScheduleForPerson = async (person, hourlyWage) => {
    const response = await fetch(
      `/schedule?person=${person.toLowerCase()}&hourlyWage=${hourlyWage}`
    );
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  generateScheduleWithFileAndPerson = async file => {
    const data = new FormData();
    data.set('scheduleFile', file);

    const response = await fetch('/upload', {
      method: 'post',
      body: data,
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleScheduleFileUploadFormSubmit = async file => {
    this.generateScheduleWithFileAndPerson(file)
      .then(() => {
        this.fetchScheduleForPerson(
          this.state.person,
          this.state.hourlyWage
        ).then(response => this.setState({ response }));
      })
      .catch(err => console.log(err));
  };

  handleHourlyWageChange = hourlyWage => {
    this.setState({ hourlyWage });
  };

  handleRefreshFormSubmit = async () => {
    this.fetchScheduleForPerson(this.state.person, this.state.hourlyWage)
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
