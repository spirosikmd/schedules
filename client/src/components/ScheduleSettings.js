import React, { PureComponent, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class ScheduleSettings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      hourlyWage: props.hourlyWage || 0.0,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    this.props.onSave &&
      this.props.onSave({
        hourlyWage: this.state.hourlyWage,
      });
  };

  handleInputChange = event => {
    const value = event.target.value;
    this.setState({ hourlyWage: value });
  };

  render() {
    const { open, hourlyWage } = this.state;

    return (
      <Fragment>
        <Button onClick={this.handleClickOpen}>Settings</Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>Update the schedule settings.</DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              id="hourly-wage"
              label="Hourly Wage"
              value={hourlyWage}
              onChange={this.handleInputChange}
              placeholder="Enter your hourly wage"
              name="hourlyWage"
              type="number"
              inputProps={{
                step: '0.01',
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default ScheduleSettings;
