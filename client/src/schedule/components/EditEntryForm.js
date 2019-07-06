import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const style = theme => ({
  workWith: {
    margin: theme.spacing(0.5),
  },
});

function getTimeDate(date, time) {
  const [hours, minutes] = time.split(':');
  return new Date(new Date(date).setHours(hours, minutes));
}

function formatDateToTime(date) {
  if (!date) return;
  const dateObject = new Date(date);
  const hours = dateObject
    .getHours()
    .toString()
    .padStart(2, '0');
  const minutes = dateObject
    .getMinutes()
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}`;
}

class EditEntryForm extends PureComponent {
  state = {
    open: false,
    hours: this.props.hours || 0,
    date: this.props.date || '',
    startTime: formatDateToTime(this.props.startTime) || '',
    endTime: formatDateToTime(this.props.endTime) || '',
    location: this.props.location || '',
    workWith: this.props.workWith || [],
    workWithPerson: '',
    isWorkingAlone: this.props.isWorkingAlone,
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleCheckChange = event => {
    const { name, checked } = event.target;
    const workWith = checked ? [] : this.props.workWith;
    this.setState({ [name]: checked, workWith });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    const { hours, date, startTime, endTime, location, workWith } = this.props;

    this.setState({
      open: false,
      hours,
      date,
      startTime: formatDateToTime(startTime),
      endTime: formatDateToTime(endTime),
      location,
      workWith,
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const {
      hours,
      date,
      startTime,
      endTime,
      location,
      workWith,
      isWorkingAlone,
    } = this.state;

    this.props.onSubmit({
      hours,
      date: new Date(date),
      startTime: getTimeDate(date, startTime),
      endTime: getTimeDate(date, endTime),
      location,
      workWith,
      isWorkingAlone,
    });

    this.setState({ open: false });
  };

  handleWorkWithKeyUp = event => {
    if (event.key !== 'Enter') return;
    const workWith = event.target.value;

    this.setState(prevState => ({
      workWith: [...prevState.workWith, workWith],
      workWithPerson: '',
    }));
  };

  handleWorkWithDelete = value => {
    const workWith = [...this.state.workWith];
    const index = workWith.indexOf(value);
    workWith.splice(index, 1);
    this.setState({ workWith });
  };

  render() {
    const { fullScreen, classes, locations } = this.props;

    return (
      <Fragment>
        <IconButton
          aria-label="Edit schedule entry"
          onClick={this.handleClickOpen}
        >
          <EditIcon />
        </IconButton>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit entry</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              margin="normal"
              id="date"
              value={this.state.date}
              onChange={this.handleInputChange}
              name="date"
              type="date"
              fullWidth
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="location">Location</InputLabel>
              <Select
                native
                value={this.state.location}
                onChange={this.handleInputChange}
                inputProps={{
                  name: 'location',
                  id: 'location',
                }}
              >
                <option value="" />
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Start time"
              margin="normal"
              id="start-time"
              value={this.state.startTime}
              onChange={this.handleInputChange}
              name="startTime"
              type="time"
              fullWidth
            />
            <TextField
              label="End time"
              margin="normal"
              id="end-time"
              value={this.state.endTime}
              onChange={this.handleInputChange}
              name="endTime"
              type="time"
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
            <TextField
              margin="normal"
              id="workWith"
              label="Work with"
              value={this.state.workWithPerson}
              onChange={this.handleInputChange}
              onKeyUp={this.handleWorkWithKeyUp}
              name="workWithPerson"
              fullWidth
              disabled={this.state.isWorkingAlone}
            />
            {this.state.workWith.map((workWith, index) => (
              <Chip
                key={index}
                label={workWith}
                className={classes.workWith}
                onDelete={() => this.handleWorkWithDelete(workWith)}
              />
            ))}
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isWorkingAlone}
                    onChange={this.handleCheckChange}
                    name="isWorkingAlone"
                    color="primary"
                  />
                }
                label="Do you work alone?"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
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
  classes: PropTypes.object.isRequired,
  locations: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(style)(withMobileDialog()(EditEntryForm));
