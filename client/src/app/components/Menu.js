import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import InboxIcon from '@material-ui/icons/InboxRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';
import ShowChartIcon from '@material-ui/icons/ShowChartRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const Menu = React.memo(
  ({ open, onMenuClose, onMenuContentClick, onMenuContentKeyDown }) => {
    return (
      <Drawer open={open} onClose={onMenuClose}>
        <nav
          tabIndex={0}
          role="button"
          onClick={onMenuContentClick}
          onKeyDown={onMenuContentKeyDown}
        >
          <List component="nav">
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/schedules">
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Schedules" />
            </ListItem>
            <ListItem button component={Link} to="/statistics">
              <ListItemIcon>
                <ShowChartIcon />
              </ListItemIcon>
              <ListItemText primary="Statistics" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </nav>
      </Drawer>
    );
  }
);

Menu.propTypes = {
  open: PropTypes.bool.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  onMenuContentClick: PropTypes.func.isRequired,
  onMenuContentKeyDown: PropTypes.func.isRequired,
};

export default Menu;
