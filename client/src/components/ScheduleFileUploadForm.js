import React, { PureComponent } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

class ScheduleFileUploadForm extends PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.fileInputRef = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();

    const fileInput = this.fileInputRef.current;

    const file = fileInput.files[0];

    if (!file) {
      return;
    }

    this.props.onSubmit(file);

    fileInput.value = '';
  }

  render() {
    return (
      <Grid container alignItems="center" justify="flex-start" spacing={8}>
        <Grid item>
          <Typography>Upload a schedule:</Typography>
        </Grid>
        <Grid item>
          <form onSubmit={this.handleSubmit}>
            <Grid
              container
              alignItems="center"
              justify="flex-start"
              spacing={8}
            >
              <Grid item>
                <TextField
                  type="file"
                  id="scheduleFile"
                  inputRef={this.fileInputRef}
                />
              </Grid>
              <Grid item>
                <Button type="submit">Upload</Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default ScheduleFileUploadForm;
