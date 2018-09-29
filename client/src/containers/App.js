import React, { Fragment, PureComponent } from 'react';
import { Router } from '@reach/router';
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
import TopBar from '../components/TopBar';
import Menu from '../components/Menu';
import Login from '../components/Login';

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
        <Login
          onGoogleLoginSuccess={this.handleGoogleLoginSuccess}
          onGoogleLoginFailure={this.handleGoogleLoginFailure}
        />
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
