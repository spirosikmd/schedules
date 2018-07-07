import React, { PureComponent } from 'react';

class RefreshForm extends PureComponent {
  constructor(props) {
    super(props);

    this.handleRefreshSubmit = this.handleRefreshSubmit.bind(this);
    this.handleHourlyWageChange = this.handleHourlyWageChange.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
    this.handleSelectedScheduleChange = this.handleSelectedScheduleChange.bind(
      this
    );
  }

  handleRefreshSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  handleHourlyWageChange(event) {
    const value = event.currentTarget.value;
    this.props.onHourlyWageChange(value);
  }

  handlePersonChange(event) {
    const value = event.currentTarget.value;
    this.props.onPersonChange(value);
  }

  handleSelectedScheduleChange(event) {
    const selectedScheduleId = event.currentTarget.value;
    this.props.onSelectedScheduleChange(selectedScheduleId);
  }

  render() {
    const { person, hourlyWage, schedules, selectedScheduleId } = this.props;

    return (
      <div className="sb-flex">
        <div className="sb-form-control sb-margin-right">
          <div className="sb-select sb-form-control__input">
            <select
              className="sb-input"
              value={selectedScheduleId}
              onChange={this.handleSelectedScheduleChange}
            >
              {schedules.map(schedule => (
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
        <form onSubmit={this.handleRefreshSubmit} className="sb-flex">
          <div className="sb-form-control sb-margin-right">
            <input
              aria-label="Person"
              placeholder="Enter your schedule name"
              className="sb-input"
              id="person"
              type="text"
              value={person}
              onChange={this.handlePersonChange}
            />
          </div>
          <div className="sb-form-control sb-margin-right">
            <input
              aria-label="Hourly Wage"
              placeholder="Enter your hourly wage"
              className="sb-input"
              id="hourly-wage"
              type="number"
              value={hourlyWage}
              onChange={this.handleHourlyWageChange}
            />
          </div>
          <button className="sb-btn sb-btn--secondary" type="submit">
            Refresh
          </button>
        </form>
      </div>
    );
  }
}

export default RefreshForm;
