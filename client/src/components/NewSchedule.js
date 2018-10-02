import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  createScheduleButton: {
    padding: theme.spacing.unit * 2,
    border: '1px dashed',
    borderRadius: theme.shape.borderRadius,
    width: '100%',
  },
});

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
    const { classes, fullScreen } = this.props;

    return (
      <Fragment>
        <ButtonBase
          className={classes.createScheduleButton}
          onClick={this.handleClickOpen}
        >
          <Typography variant="button">new schedule</Typography>
        </ButtonBase>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New Schedule</DialogTitle>
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
            <Button onClick={this.handleClose} color="primary">
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

export default withStyles(styles)(withMobileDialog()(NewSchedule));
