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
      <div>
        <header className="sb-header">
          <button
            className="sb-header__back"
            aria-label="Back"
            onClick={this.handleBackButtonClick}
          >
            <svg className="sb-icon" viewBox="0 0 9 16">
              <path d="M8.02631579,16 C8.13407895,16 8.24181579,15.9588947 8.32402632,15.8766579 C8.48847368,15.7122368 8.48847368,15.4456316 8.32402632,15.2812105 L1.04281579,8 L8.32402632,0.718763158 C8.48847368,0.554342105 8.48847368,0.287736842 8.32402632,0.123315789 C8.15957895,-0.0411052632 7.893,-0.0411315789 7.72857895,0.123315789 L0.149631579,7.70226316 C-0.0148157895,7.86668421 -0.0148157895,8.13328947 0.149631579,8.29771053 L7.72857895,15.8766579 C7.81081579,15.9588947 7.91855263,16 8.02631579,16 L8.02631579,16 Z" />
            </svg>
          </button>
          <div className="sb-header__content">
            <div className="sb-header__text">
              <h1 className="sb-header__title sb-title">Settings</h1>
            </div>
          </div>
        </header>
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
