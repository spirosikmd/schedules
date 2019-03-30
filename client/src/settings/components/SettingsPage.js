import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DeleteUserDialog from './DeleteUserDialog';
import { deleteUserAndLogout } from '../actions';
import withAuth from '../../shared/components/withAuth';

const styles = theme => ({
  dangerZone: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

const SettingsPage = React.memo(({ deleteUserAndLogout, classes }) => {
  const handleDeleteClick = async () => {
    await deleteUserAndLogout();
    navigate('/');
  };

  return (
    <Paper className={classes.dangerZone}>
      <Typography variant="h5" gutterBottom>
        Danger zone
      </Typography>
      <DeleteUserDialog onDeleteClick={handleDeleteClick} />
    </Paper>
  );
});

SettingsPage.propTypes = {
  deleteUserAndLogout: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  deleteUserAndLogout,
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(withAuth(SettingsPage))
);
