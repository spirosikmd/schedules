import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 24,
  },
});

const Loader = React.memo(({ loading, classes }) => {
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
