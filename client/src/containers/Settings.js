import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {
  fetchSettingsForUser,
  updateSettingsForUser,
} from '../actions/settingsActions';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

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
    const { classes } = this.props;
    const { newSettings, isSaving } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <Grid container justify="flex-start" alignItems="center">
          <Grid item>
            <TextField
              id="person"
              label="Person"
              value={newSettings.person}
              onChange={this.handleInputChange}
              margin="normal"
              placeholder="Enter your schedule name"
              name="person"
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <TextField
              id="hourly-wage"
              label="Hourly Wage"
              value={newSettings.hourlyWage}
              onChange={this.handleInputChange}
              margin="normal"
              placeholder="Enter your hourly wage"
              name="hourlyWage"
              type="number"
              inputProps={{
                step: '0.01',
              }}
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </form>
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

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Settings)
);
