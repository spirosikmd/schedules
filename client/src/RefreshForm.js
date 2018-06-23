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
      <form onSubmit={this.handleRefreshSubmit}>
        <div className="sb-form-control">
          <label className="sb-label" htmlFor="hourly-wage">
            Hourly Wage:
          </label>
          <input
            className="sb-input"
            id="hourly-wage"
            type="number"
            value={this.props.hourlyWage}
            onChange={this.handleHourlyWageChange}
          />
        </div>
        <button className="sb-btn" type="submit">
          Refresh
        </button>
      </form>
    );
  }
}

export default RefreshForm;
