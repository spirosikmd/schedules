import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

const Login = React.memo(
  ({ classes, isLoggingIn, onGoogleLoginSuccess, onGoogleLoginFailure }) => {
    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <form className={classes.form}>
            <GoogleLogin
              clientId="1052222050887-labkfk5agrcfn4dbfaf0qitjq635s5nv.apps.googleusercontent.com"
              icon={false}
              isSignedIn
              onSuccess={onGoogleLoginSuccess}
              onFailure={onGoogleLoginFailure}
              render={props => (
                <Button
                  onClick={props.onClick}
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.submit}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Loading...' : 'Google'}
                </Button>
              )}
            />
          </form>
        </Paper>
      </main>
    );
  }
);

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
  onGoogleLoginSuccess: PropTypes.func.isRequired,
  onGoogleLoginFailure: PropTypes.func.isRequired,
};

export default withStyles(styles)(Login);
