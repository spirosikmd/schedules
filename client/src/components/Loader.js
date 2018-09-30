import React, { PureComponent } from 'react';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 24,
  },
});

class Loader extends PureComponent {
  render() {
    const { loading, classes } = this.props;

    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Fade in={loading} unmountOnExit>
          <CircularProgress />
        </Fade>
      </Grid>
    );
  }
}

export default withStyles(styles)(Loader);
