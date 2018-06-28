import React, { PureComponent } from 'react';

class RefreshForm extends PureComponent {
  handleRefreshSubmit = event => {
    event.preventDefault();
    this.props.onSubmit();
  };

  handleHourlyWageChange = event => {
    const value = event.currentTarget.value;
    this.props.onHourlyWageChange(value);
  };

  handleSelectedScheduleChange = event => {
    const selectedScheduleId = event.currentTarget.value;
    this.props.onSelectedScheduleChange(selectedScheduleId);
  };

  render() {
    const { schedules, selectedScheduleId } = this.props;

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
              aria-label="Hourly Wage"
              placeholder="Enter your hourly wage"
              className="sb-input"
              id="hourly-wage"
              type="number"
              value={this.props.hourlyWage}
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
