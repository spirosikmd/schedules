import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import notFound from './notFound.svg';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing.unit * 8,
  },
  image: {
    width: '75%',
    height: '75%',
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

export default withStyles(styles)(NotFound);
