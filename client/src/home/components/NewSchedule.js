import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class NewSchedule extends PureComponent {
  state = {
    open: false,
    name: '',
  };

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCreateClick = () => {
    this.handleClose();

    const { name } = this.state;

    this.props.onCreate({ name });
  };

  render() {
    const { fullScreen } = this.props;

    return (
      <Fragment>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleClickOpen}
        >
          create new
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create new schedule</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide the following details to create new schedule.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              name="name"
              fullWidth
              onChange={this.handleChange}
              value={this.state.name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleCreateClick} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

NewSchedule.propTypes = {
  onCreate: PropTypes.func,
};

NewSchedule.defaultProps = {
  onCreate: () => {},
};

export default withMobileDialog()(NewSchedule);
