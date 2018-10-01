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
import withAuth from '../components/withAuth';
import Loader from '../components/Loader';

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
    },
    isSaving: false,
    isLoading: true,
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchSettingsForUser().then(() => {
      const { person } = this.props.settings;
      this.setState({
        newSettings: { person },
        isLoading: false,
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
    const { person } = this.state.newSettings;

    this.props.updateSettingsForUser(settingsId, person).then(() => {
      const { person } = this.props.settings;
      this.setState({
        newSettings: { person },
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
    const { newSettings, isSaving, isLoading } = this.state;

    if (isLoading) {
      return <Loader loading={isLoading} />;
    }

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
  settings: state.settingsReducer.settings,
});

const mapDispatchToProps = dispatch => ({
  fetchSettingsForUser: () => dispatch(fetchSettingsForUser()),
  updateSettingsForUser: (settingsId, person) =>
    dispatch(updateSettingsForUser(settingsId, person)),
});

export default withAuth(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Settings)
  )
);
