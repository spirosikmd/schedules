import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Add from '@material-ui/icons/Add';

class CreateEntryForm extends PureComponent {
  state = {
    open: false,
    hours: 0,
    date: '',
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { hours, date } = this.state;

    this.props.onSubmit({ hours, date: new Date(date) });
    this.handleClose();

    this.setState({ hours: 0, date: '' });
  };

  render() {
    const { fullScreen } = this.props;

    return (
      <Fragment>
        <IconButton onClick={this.handleClickOpen}>
          <Add />
        </IconButton>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create new entry</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              id="date"
              value={this.state.date}
              onChange={this.handleInputChange}
              placeholder="When?"
              name="date"
              type="date"
              fullWidth
            />
            <TextField
              margin="normal"
              id="hours"
              label="Hours"
              value={this.state.hours}
              onChange={this.handleInputChange}
              placeholder="How many hours?"
              name="hours"
              type="number"
              inputProps={{
                min: 0,
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

CreateEntryForm.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withMobileDialog()(CreateEntryForm);
