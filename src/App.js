import React, { Component } from 'react';
import Schedule from './Schedule';
import RefreshForm from './RefreshForm';
import ScheduleFileUploadForm from './ScheduleFileUploadForm';
import {
  fetchScheduleForPerson,
  generateScheduleWithFileAndPerson,
  fetchSchedules,
  fetchSelectedScheduleId,
  fetchHourlyWage,
} from './api';

class App extends Component {
  state = {
    schedule: [],
    totalHours: 0,
    totalWeeklyWage: 0,
    person: 'Jenny',
    hourlyWage: 0,
    selectedScheduleId: '',
    schedules: [],
  };

  componentDidMount() {
    fetchSchedules()
      .then(schedules => {
        this.setState({ schedules });

        Promise.all([fetchSelectedScheduleId(), fetchHourlyWage()])
          .then(([selectedScheduleId, hourlyWage]) => {
            this.setState({ selectedScheduleId, hourlyWage });

            fetchScheduleForPerson(
              selectedScheduleId,
              this.state.person,
              hourlyWage
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
        fetchScheduleForPerson(
          this.state.selectedScheduleId,
          this.state.person,
          this.state.hourlyWage
        ).then(response =>
          this.setState({
            schedule: response.schedule,
            totalHours: response.totalHours,
            totalWeeklyWage: response.totalWeeklyWage,
          })
        );
      })
      .catch(err => console.log(err));
  };

  handleHourlyWageChange = hourlyWage => {
    this.setState({ hourlyWage });
  };

  handleRefreshFormSubmit = async () => {
    fetchScheduleForPerson(
      this.state.selectedScheduleId,
      this.state.person,
      this.state.hourlyWage
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
    alert('create events');
  };

  handleSelectedScheduleChange = event => {
    this.setState({ selectedScheduleId: event.target.value });
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
              <div className="sb-flex">
                <div className="sb-form-control sb-margin-right">
                  <div className="sb-select sb-form-control__input">
                    <select
                      className="sb-input"
                      value={this.state.selectedScheduleId}
                      onChange={this.handleSelectedScheduleChange}
                    >
                      {this.state.schedules.map(schedule => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.name}
                        </option>
                      ))}
                    </select>
                    <svg className="sb-icon" viewBox="-5 -5 16 16">
                      <path d="M0 0l3.5 4L7 0H0" />
                    </svg>
                  </div>
                </div>
                <RefreshForm
                  hourlyWage={this.state.hourlyWage}
                  onHourlyWageChange={this.handleHourlyWageChange}
                  onSubmit={this.handleRefreshFormSubmit}
                />
              </div>
              <div>
                <button
                  className="sb-btn sb-btn--primary"
                  onClick={this.handleCreateEventsClick}
                >
                  create events
                </button>
              </div>
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
