import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class ScheduleFileUploadForm extends PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.fileInputRef = React.createRef();

    this.state = {
      open: false,
      hourlyWage: 0,
      person: '',
    };
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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

    const { hourlyWage, person } = this.state;

    this.props.onSubmit(file, hourlyWage, person);
    this.handleClose();

    fileInput.value = '';
    this.setState({ hourlyWage: 0, person: '' });
  }

  render() {
    const { fullScreen } = this.props;

    return (
      <Fragment>
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleClickOpen}
        >
          Upload
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Upload new schedule</DialogTitle>
          <DialogContent>
            <TextField
              type="file"
              id="scheduleFile"
              inputRef={this.fileInputRef}
              fullWidth
            />
            <TextField
              margin="normal"
              id="person"
              label="Set your name in the schedule file"
              value={this.state.person}
              onChange={this.handleInputChange}
              placeholder={`For example angela, or jenny`}
              name="person"
              fullWidth
            />
            <TextField
              margin="normal"
              id="hourly-wage"
              label="Set an hourly Wage"
              value={this.state.hourlyWage}
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
            <Button onClick={this.handleClose} color="secondary">
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

ScheduleFileUploadForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default withMobileDialog()(ScheduleFileUploadForm);
