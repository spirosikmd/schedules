import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

class EditEntryForm extends PureComponent {
  state = {
    open: false,
    hours: this.props.hours || 0,
    date: this.props.date || '',
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    const { hours, date } = this.props;

    this.setState({ open: false, hours, date });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { hours, date } = this.state;

    this.props.onSubmit({ hours, date: new Date(date) });

    this.setState({ open: false });
  };

  render() {
    const { fullScreen } = this.props;

    return (
      <Fragment>
        <IconButton onClick={this.handleClickOpen}>
          <EditIcon />
        </IconButton>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit entry</DialogTitle>
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
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditEntryForm.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  hours: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withMobileDialog()(EditEntryForm);
