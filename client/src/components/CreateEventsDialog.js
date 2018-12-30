import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class CreateEventsDialog extends PureComponent {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    if (this.props.eventsCreatedOnce) {
      this.setState({ open: true });
      return;
    }
    this.props.onCreateEventsClick();
  };

  handleCreateClick = () => {
    this.closeDialog();
    this.props.onCreateEventsClick();
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  render() {
    const { fullScreen, isCreatingEvents } = this.props;

    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
          disabled={isCreatingEvents}
        >
          {isCreatingEvents ? 'creating events...' : 'create events'}
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.closeDialog}
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
            <Button onClick={this.closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCreateClick} color="primary" autoFocus>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
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

export default withMobileDialog()(CreateEventsDialog);
