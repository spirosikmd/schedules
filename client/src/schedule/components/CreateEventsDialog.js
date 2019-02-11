import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import useToggle from '../../shared/components/useToggle';

function CreateEventsDialog({
  fullScreen,
  eventsCreatedOnce,
  isCreatingEvents,
  onCreateEventsClick,
}) {
  const [open, toggleOpen] = useToggle();

  const handleClickOpen = () => {
    if (eventsCreatedOnce) {
      toggleOpen(true);
      return;
    }
    onCreateEventsClick();
  };

  const handleCreateClick = () => {
    toggleOpen(false);
    onCreateEventsClick();
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        disabled={isCreatingEvents}
      >
        {isCreatingEvents ? 'creating events...' : 'create events'}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={toggleOpen}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Create events</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have created events for this schedule once. Do you want to
            create them again?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOpen} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateClick} color="primary" autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreateEventsDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  eventsCreatedOnce: PropTypes.bool.isRequired,
  isCreatingEvents: PropTypes.bool.isRequired,
  onCreateEventsClick: PropTypes.func.isRequired,
};

CreateEventsDialog.defaultProps = {
  eventsCreatedOnce: false,
};

export default withMobileDialog()(memo(CreateEventsDialog));
