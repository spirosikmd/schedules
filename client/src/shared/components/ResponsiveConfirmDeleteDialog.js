import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import useToggle from './useToggle';

function ResponsiveConfirmDeleteDialog({
  fullScreen,
  title,
  content,
  onDeleteClick,
  onCancelClick,
}) {
  const [open, toggleOpen] = useToggle();

  const handleCancelClick = () => {
    toggleOpen(false);
    onCancelClick();
  };

  const handleDeleteClick = () => {
    toggleOpen(false);
    onDeleteClick();
  };

  return (
    <div>
      <IconButton aria-label="Delete schedule" onClick={toggleOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={toggleOpen}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClick} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ResponsiveConfirmDeleteDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  onCancelClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

ResponsiveConfirmDeleteDialog.defaultProps = {
  onCancelClick: () => {},
  onDeleteClick: () => {},
};

export default withMobileDialog()(memo(ResponsiveConfirmDeleteDialog));
