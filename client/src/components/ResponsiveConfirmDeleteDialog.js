import React, { PureComponent } from 'react';
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

class ResponsiveConfirmDeleteDialog extends PureComponent {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleCancelClick = () => {
    this.closeDialog();
    this.props.onCancelClick();
  };

  handleDeleteClick = () => {
    this.closeDialog();
    this.props.onDeleteClick();
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  render() {
    const { fullScreen, title, content } = this.props;

    return (
      <div>
        <IconButton aria-label="Delete schedule" onClick={this.handleClickOpen}>
          <DeleteIcon />
        </IconButton>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.closeDialog}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancelClick} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDeleteClick} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
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

export default withMobileDialog()(ResponsiveConfirmDeleteDialog);
