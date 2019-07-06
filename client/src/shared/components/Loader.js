import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(24),
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

Loader.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Loader);
