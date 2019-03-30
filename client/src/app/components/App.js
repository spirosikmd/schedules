import React, { Fragment, PureComponent, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Router, navigate } from '@reach/router';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../../shared/components/Loader';
import { setUser } from '../../shared/actions';
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
const RegisterPage = lazy(() => import('../../auth/components/RegisterPage'));
const LoginPage = lazy(() => import('../../auth/components/LoginPage'));

const styles = theme => ({
  page: {
    margin: theme.spacing(2),
  },
});

class App extends PureComponent {
  state = {
    isDrawerOpen: false,
  };

  handleGoogleLogoutSuccess = () => {
    this.props.setUser(null);
    navigate('/login');
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
          <Suspense fallback={<Loader loading={true} />}>
            <Router>
              <LoginPage default path="/login" />
              <RegisterPage path="/register" />
            </Router>
          </Suspense>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <CssBaseline />
        <TopBar
          user={user}
          onMenuIconClick={() => this.toggleDrawer(true)}
          onLogoutClick={this.handleGoogleLogoutSuccess}
          onGoogleLogoutSuccess={this.handleGoogleLogoutSuccess}
        />
        <Menu
          open={this.state.isDrawerOpen}
          numberOfSchedules={this.props.numberOfSchedules}
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
  numberOfSchedules: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  numberOfSchedules: state.schedulesReducer.schedules.length,
});

const mapDispatchToProps = {
  setUser,
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
