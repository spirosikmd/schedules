import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';
import useToggle from '../../shared/components/useToggle';

const styles = theme => ({
  button: {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
});

function DeleteUserDialog({ fullScreen, classes, onDeleteClick }) {
  const [open, toggleOpen] = useToggle();

  const handleDeleteClick = () => {
    toggleOpen(false);
    onDeleteClick();
  };

  return (
    <Fragment>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={toggleOpen}
      >
        Delete me
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={toggleOpen}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Delete me</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All your data and schedules will be deleted. This cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOpen} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClick} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

DeleteUserDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default withMobileDialog()(withStyles(styles)(DeleteUserDialog));
