import React, { PureComponent } from 'react';
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
  avatar: {
    cursor: 'pointer',
  },
};

class TopBar extends PureComponent {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      user,
      onMenuIconClick,
      onGoogleLogoutSuccess,
      classes,
      profileImageUrl,
    } = this.props;
    const { anchorEl } = this.state;
    const name = `${user.firstName} ${user.lastName}`;

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
            <div className={classes.grow} />
            <Avatar
              className={classes.avatar}
              alt={name}
              src={profileImageUrl}
              aria-owns={anchorEl ? 'account-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            />
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
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
}

TopBar.propTypes = {
  user: PropTypes.object.isRequired,
  onMenuIconClick: PropTypes.func.isRequired,
  onGoogleLogoutSuccess: PropTypes.func.isRequired,
  profileImageUrl: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
