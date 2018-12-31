import React from 'react';
import { Link } from '@reach/router';
import InboxIcon from '@material-ui/icons/Inbox';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const Menu = React.memo(
  ({ open, onMenuClose, onMenuContentClick, onMenuContentKeyDown }) => {
    return (
      <Drawer open={open} onClose={onMenuClose}>
        <div
          tabIndex={0}
          role="button"
          onClick={onMenuContentClick}
          onKeyDown={onMenuContentKeyDown}
        >
          <List component="nav">
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
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
        </div>
      </Drawer>
    );
  }
);

export default Menu;
