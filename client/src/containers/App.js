import React, { Fragment, PureComponent, Suspense, lazy } from 'react';
import { Router, navigate } from '@reach/router';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { setUser, createUserFromAccessToken } from '../actions/authActions';
import Login from '../components/Login';
import Loader from '../components/Loader';
import TopBar from '../components/TopBar';
import Menu from '../components/Menu';

const Home = lazy(() => import('../components/Home'));
const Schedule = lazy(() => import('../components/Schedule'));
const Charts = lazy(() => import('../components/Charts'));
const SettingsPage = lazy(() => import('../settings/SettingsPage'));

const styles = theme => ({
  page: {
    margin: theme.spacing.unit * 2,
  },
});

class App extends PureComponent {
  state = {
    error: {
      errorCode: '',
      details: '',
    },
    isDrawerOpen: false,
    profileImageUrl: '',
  };

  handleGoogleLoginSuccess = response => {
    this.props.createUserFromAccessToken(
      response.accessToken,
      response.tokenObj.expires_in
    );
    this.setState({ profileImageUrl: response.profileObj.imageUrl });
  };

  handleGoogleLoginFailure = ({ error, details }) => {
    this.setState({ error: { errorCode: error, details } });
  };

  handleGoogleLogoutSuccess = () => {
    this.props.setUser(null);
    navigate('/');
  };

  toggleDrawer(isDrawerOpen) {
    this.setState({ isDrawerOpen });
  }

  render() {
    const { user, classes } = this.props;

    if (user === null || user === undefined) {
      return (
        <Fragment>
          <CssBaseline />
          <Login
            onGoogleLoginSuccess={this.handleGoogleLoginSuccess}
            onGoogleLoginFailure={this.handleGoogleLoginFailure}
          />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <CssBaseline />
        <TopBar
          user={user}
          profileImageUrl={this.state.profileImageUrl}
          onMenuIconClick={() => this.toggleDrawer(true)}
          onGoogleLogoutSuccess={this.handleGoogleLogoutSuccess}
        />
        <Menu
          open={this.state.isDrawerOpen}
          onMenuClose={() => this.toggleDrawer(false)}
          onMenuContentClick={() => this.toggleDrawer(false)}
          onMenuContentKeyDown={() => this.toggleDrawer(false)}
        />
        <div className={classes.page}>
          <Suspense fallback={<Loader loading={true} />}>
            <Router>
              <Home path="/" />
              <Schedule path="/schedules/:scheduleId" />
              <Charts path="/charts" />
              <SettingsPage path="/settings" />
            </Router>
          </Suspense>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  createUserFromAccessToken: (accessToken, expiresIn) =>
    dispatch(createUserFromAccessToken(accessToken, expiresIn)),
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
