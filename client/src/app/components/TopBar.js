import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogout } from 'react-google-login';

const styles = {
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  avatar: {
    cursor: 'pointer',
  },
};

function TopBar({
  user,
  onMenuIconClick,
  onGoogleLogoutSuccess,
  classes,
  profileImageUrl,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const name = `${user.firstName} ${user.lastName}`;

  return (
    <div className={classes.grow}>
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
          <div className={classes.grow} />
          <Avatar
            className={classes.avatar}
            alt={name}
            src={profileImageUrl}
            aria-owns={anchorEl ? 'account-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          />
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled={true}>{name}</MenuItem>
            <GoogleLogout
              icon={false}
              onLogoutSuccess={onGoogleLogoutSuccess}
              render={props => (
                <MenuItem onClick={props.onClick}>Logout</MenuItem>
              )}
            />
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}

TopBar.propTypes = {
  user: PropTypes.object.isRequired,
  onMenuIconClick: PropTypes.func.isRequired,
  onGoogleLogoutSuccess: PropTypes.func.isRequired,
  profileImageUrl: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
