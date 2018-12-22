import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogout } from 'react-google-login';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const TopBar = React.memo(
  ({ user, onMenuIconClick, onGoogleLogoutSuccess, classes }) => {
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={onMenuIconClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {user.firstName} {user.lastName}!
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
      </div>
    );
  }
);

export default withStyles(styles)(TopBar);
