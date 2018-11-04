import React, { PureComponent, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class ScheduleFileUploadForm extends PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.fileInputRef = React.createRef();

    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit(event) {
    event.preventDefault();

    const fileInput = this.fileInputRef.current;

    const file = fileInput.files[0];

    if (!file) {
      return;
    }

    this.props.onSubmit(file);
    this.handleClose();

    fileInput.value = '';
  }

  render() {
    const { open } = this.state;

    return (
      <Fragment>
        <Button onClick={this.handleClickOpen}>Upload</Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Upload a new schedule
          </DialogTitle>
          <DialogContent>
            <TextField
              type="file"
              id="scheduleFile"
              inputRef={this.fileInputRef}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default ScheduleFileUploadForm;
