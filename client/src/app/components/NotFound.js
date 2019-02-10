import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import notFound from './notFound.svg';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing.unit * 8,
  },
  image: {
    width: '400px',
    height: '400px',
    [theme.breakpoints.down('sm')]: {
      width: '75%',
      height: '75%',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '50%',
      height: '50%',
    },
  },
  text: {
    marginTop: theme.spacing.unit * 4,
  },
});

const NotFound = React.memo(({ classes }) => {
  return (
    <div className={classes.root}>
      <img className={classes.image} alt="Not found" src={notFound} />
      <Typography variant="h6" color="secondary" className={classes.text}>
        Taken! Not found...
      </Typography>
    </div>
  );
});

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);
