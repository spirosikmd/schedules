import React from 'react';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 24,
  },
});

const Loader = React.memo(function({ loading, classes }) {
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
});

export default withStyles(styles)(Loader);
