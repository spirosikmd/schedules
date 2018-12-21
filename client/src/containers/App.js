import React, { Fragment, PureComponent, Suspense, lazy } from 'react';
import { Router } from '@reach/router';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { setUser, createUserFromAccessToken } from '../actions/authActions';
import Login from '../components/Login';
import Loader from '../components/Loader';

const TopBar = lazy(() => import('../components/TopBar'));
const Menu = lazy(() => import('../components/Menu'));
const Home = lazy(() => import('../components/Home'));
const Schedule = lazy(() => import('../components/Schedule'));
const Charts = lazy(() => import('../components/Charts'));

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
  }

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
      <Suspense fallback={<Loader loading={true} />}>
        <CssBaseline />
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
        <div className={classes.page}>
          <Router>
            <Home path="/" />
            <Schedule path="/schedules/:scheduleId" />
            <Charts path="/charts" />
          </Router>
        </div>
      </Suspense>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  createUserFromAccessToken: accessToken =>
    dispatch(createUserFromAccessToken(accessToken)),
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
