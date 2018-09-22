import React, { Fragment, PureComponent } from 'react';
import { Router } from '@reach/router';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';
import Home from './Home';
import Settings from './Settings';
import Schedule from './Schedule';
import Charts from './Charts';
import {
  setUser,
  setToken,
  createUserFromAccessToken,
} from '../actions/authActions';
import Button from '@material-ui/core/Button';
import TopBar from '../components/TopBar';
import Menu from '../components/Menu';

class App extends PureComponent {
  state = {
    error: {
      errorCode: '',
      details: '',
    },
    isDrawerOpen: false,
  };

  constructor(props) {
    super(props);

    this.handleGoogleLoginSuccess = this.handleGoogleLoginSuccess.bind(this);
    this.handleGoogleLoginFailure = this.handleGoogleLoginFailure.bind(this);
    this.handleGoogleLogoutSuccess = this.handleGoogleLogoutSuccess.bind(this);
  }

  handleGoogleLoginSuccess(response) {
    this.props.createUserFromAccessToken(response.accessToken);
  }

  handleGoogleLoginFailure({ error, details }) {
    this.setState({ error: { errorCode: error, details } });
  }

  handleGoogleLogoutSuccess() {
    this.props.setUser(null);
    this.props.setToken(null);
  }

  toggleDrawer(isDrawerOpen) {
    this.setState({ isDrawerOpen });
  }

  render() {
    const { user } = this.props;

    if (user === null) {
      return (
        <Button
          variant="outlined"
          color="inherit"
          component={GoogleLogin}
          clientId="1052222050887-labkfk5agrcfn4dbfaf0qitjq635s5nv.apps.googleusercontent.com"
          buttonText="Login"
          scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.me"
          isSignedIn
          onSuccess={this.handleGoogleLoginSuccess}
          onFailure={this.handleGoogleLoginFailure}
        >
          Login
        </Button>
      );
    }

    return (
      <Fragment>
        <TopBar
          user={user}
          onMenuIconClick={() => this.toggleDrawer(true)}
          onGoogleLogoutSuccess={this.handleGoogleLogoutSuccess}
        />
        <Menu
          open={this.state.isDrawerOpen}
          onMenuClose={() => this.toggleDrawer(false)}
          onMenuContentClick={() => this.toggleDrawer(false)}
          onMenuContentKeyDown={() => this.toggleDrawer(false)}
        />
        <Router>
          <Home path="/" />
          <Schedule path="/schedules/:scheduleId" />
          <Settings path="/settings" />
          <Charts path="/charts" />
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  setToken: token => dispatch(setToken(token)),
  createUserFromAccessToken: accessToken =>
    dispatch(createUserFromAccessToken(accessToken)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
