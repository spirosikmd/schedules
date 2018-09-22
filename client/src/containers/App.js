import React, { Fragment, PureComponent } from 'react';
import { Router, Link } from '@reach/router';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/Inbox';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

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
        <AppBar position="static" style={{ flexGrow: 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={() => this.toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" style={{ flexGrow: 1 }}>
              Welcome to {this.props.user.firstName} schedule
            </Typography>
            <Button
              color="inherit"
              component={GoogleLogout}
              onLogoutSuccess={this.handleGoogleLogoutSuccess}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          open={this.state.isDrawerOpen}
          onClose={() => this.toggleDrawer(false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.toggleDrawer(false)}
            onKeyDown={() => this.toggleDrawer(false)}
          >
            <List component="nav">
              <ListItem button component={Link} to="/">
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/charts">
                <ListItemIcon>
                  <ShowChartIcon />
                </ListItemIcon>
                <ListItemText primary="Charts" />
              </ListItem>
              <ListItem button component={Link} to="/settings">
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </div>
        </Drawer>
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
