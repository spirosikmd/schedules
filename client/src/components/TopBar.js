import React, { PureComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { GoogleLogout } from 'react-google-login';

class TopBar extends PureComponent {
  render() {
    const { user, onMenuIconClick, onGoogleLogoutSuccess } = this.props;

    return (
      <AppBar position="static" style={{ flexGrow: 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={onMenuIconClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" style={{ flexGrow: 1 }}>
            Welcome to {user.firstName} schedule
          </Typography>
          <Button
            color="inherit"
            component={GoogleLogout}
            onLogoutSuccess={onGoogleLogoutSuccess}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
