import React, { Fragment, PureComponent, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
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

const NotFound = lazy(() => import('./NotFound'));
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
const HomePage = lazy(() => import('../../home/components/HomePage'));

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
    isLoggingIn: false,
  };

  handleGoogleLoginSuccess = async response => {
    this.setState({ isLoggingIn: true });
    await this.props.createUserFromAccessToken(
      response.accessToken,
      response.tokenObj.expires_in
    );
    this.setState({
      profileImageUrl: response.profileObj.imageUrl,
      isLoggingIn: false,
    });
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
            isLoggingIn={this.state.isLoggingIn}
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
        <main className={classes.page}>
          <Suspense fallback={<Loader loading={true} />}>
            <Router>
              <NotFound default />
              <HomePage path="/" />
              <SchedulesPage path="/schedules" />
              <SchedulePage path="/schedules/:scheduleId" />
              <StatisticsPage path="/statistics" />
              <SettingsPage path="/settings" />
            </Router>
          </Suspense>
        </main>
      </Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
  createUserFromAccessToken: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
});

const mapDispatchToProps = {
  setUser,
  createUserFromAccessToken,
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
