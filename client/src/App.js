import React, { PureComponent } from 'react';
import { Router } from '@reach/router';
import { GoogleLogin } from 'react-google-login';
import Home from './Home';
import Settings from './Settings';
import Schedule from './Schedule';
import Charts from './Charts';
import { createUser } from './api';

class App extends PureComponent {
  state = {
    authUser: null,
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

  handleGoogleLoginSuccess(authUser) {
    createUser(authUser.profileObj.email).then(() =>
      this.setState({ authUser })
    );
  }

  handleGoogleLoginFailure({ error, details }) {
    this.setState({ error: { errorCode: error, details } });
  }

  handleGoogleLogoutSuccess() {
    this.setState({ authUser: null });
  }

  render() {
    const { authUser } = this.state;

    if (authUser === null) {
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
        <Home
          path="/"
          authUser={authUser}
          onGoogleLogoutSuccess={this.handleGoogleLogoutSuccess}
        />
        <Schedule path="/schedules/:scheduleId" authUser={authUser} />
        <Settings path="/settings" authUser={authUser} />
        <Charts path="/charts" authUser={authUser} />
      </Router>
    );
  }
}

export default App;
