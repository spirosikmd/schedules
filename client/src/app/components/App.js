import React, { Fragment, PureComponent, Suspense, lazy } from 'react';
import { Router, navigate } from '@reach/router';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../../shared/components/Loader';
import { setUser } from '../../shared/actions';
import { createUserFromAccessToken } from '../actions';
import Login from './Login';
import TopBar from './TopBar';
import Menu from './Menu';

const SchedulesPage = lazy(() =>
  import('../../schedules/components/SchedulesPage')
);
const SchedulePage = lazy(() =>
  import('../../schedule/components/SchedulePage')
);
const StatisticsPage = lazy(() =>
  import('../../statistics/components/StatisticsPage')
);
const SettingsPage = lazy(() =>
  import('../../settings/components/SettingsPage')
);

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
              <SchedulesPage path="/" />
              <SchedulePage path="/schedules/:scheduleId" />
              <StatisticsPage path="/statistics" />
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
