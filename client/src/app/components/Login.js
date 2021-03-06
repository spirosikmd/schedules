import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  avatar: {
    margin: theme.spacing(),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing(),
  },
  submit: {
    marginTop: theme.spacing(3),
    position: 'relative',
  },
  submitProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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
              scope="https://www.googleapis.com/auth/calendar.events"
              render={props => (
                <div className={classes.submit}>
                  <Button
                    onClick={props.onClick}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoggingIn}
                  >
                    Google
                  </Button>
                  {isLoggingIn && (
                    <CircularProgress
                      size={24}
                      className={classes.submitProgress}
                    />
                  )}
                </div>
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
