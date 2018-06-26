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

  render() {
    return (
      <form onSubmit={this.handleRefreshSubmit} className="sb-flex">
        <div className="sb-form-control">
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
        <button className="sb-btn sb-margin-left" type="submit">
          Refresh
        </button>
      </form>
    );
  }
}

export default RefreshForm;
