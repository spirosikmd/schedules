import React, { PureComponent } from 'react';
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
} from '../actions/userActions';

class App extends PureComponent {
  state = {
    error: {
      errorCode: '',
      details: '',
    },
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

  render() {
    const { user } = this.props;

    if (user === null) {
      return (
        <div className="sb-container sb-padding">
          <GoogleLogin
            className="sb-btn sb-btn--primary"
            clientId="1052222050887-labkfk5agrcfn4dbfaf0qitjq635s5nv.apps.googleusercontent.com"
            buttonText="Login"
            scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.me"
            isSignedIn
            onSuccess={this.handleGoogleLoginSuccess}
            onFailure={this.handleGoogleLoginFailure}
          />
        </div>
      );
    }

    return (
      <Router>
        <Home path="/" onGoogleLogoutSuccess={this.handleGoogleLogoutSuccess} />
        <Schedule path="/schedules/:scheduleId" />
        <Settings path="/settings" />
        <Charts path="/charts" />
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
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
