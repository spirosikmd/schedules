import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  fetchSettingsForUser,
  updateSettingsForUser,
} from '../actions/settingsActions';

class Settings extends PureComponent {
  state = {
    newSettings: {
      person: '',
      hourlyWage: 0,
    },
    isSaving: false,
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const { token } = this.props;

    this.props.fetchSettingsForUser(token).then(() => {
      const { person, hourlyWage } = this.props.settings;
      this.setState({
        newSettings: { person, hourlyWage },
      });
    });
  }

  handleBackButtonClick(event) {
    event.preventDefault();
    this.props.navigate('/');
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ isSaving: true });

    const { _id: settingsId } = this.props.settings;
    const { hourlyWage, person } = this.state.newSettings;
    const { token } = this.props;

    this.props
      .updateSettingsForUser(token, settingsId, hourlyWage, person)
      .then(() => {
        const { person, hourlyWage } = this.props.settings;
        this.setState({
          newSettings: { person, hourlyWage },
          isSaving: false,
        });
      });
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    const newSettings = {
      ...this.state.newSettings,
      ...{ [name]: value },
    };
    this.setState({ newSettings });
  }

  render() {
    const { newSettings, isSaving } = this.state;

    return (
      <div className="sb-padding">
        <form onSubmit={this.handleSubmit} className="sb-flex">
          <div className="sb-form-control sb-margin-right">
            <input
              aria-label="Person"
              placeholder="Enter your schedule name"
              className="sb-input"
              id="person"
              type="text"
              value={newSettings.person}
              name="person"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="sb-form-control sb-margin-right">
            <input
              aria-label="Hourly Wage"
              placeholder="Enter your hourly wage"
              className="sb-input"
              id="hourly-wage"
              type="number"
              step="0.01"
              value={newSettings.hourlyWage}
              name="hourlyWage"
              onChange={this.handleInputChange}
            />
          </div>
          <button
            className="sb-btn sb-btn--secondary"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.authReducer.token,
  settings: state.settingsReducer.settings,
});

const mapDispatchToProps = dispatch => ({
  fetchSettingsForUser: token => dispatch(fetchSettingsForUser(token)),
  updateSettingsForUser: (token, settingsId, hourlyWage, person) =>
    dispatch(updateSettingsForUser(token, settingsId, hourlyWage, person)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
