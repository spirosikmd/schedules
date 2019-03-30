import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { Link } from '@reach/router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { createUserFromAccessToken, login } from '../../app/actions';
import { setUserProfileImageUrl } from '../actions';
import MessageSnackbar from '../../shared/components/MessageSnackbar';

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
  loginButton: {
    marginTop: theme.spacing(3),
  },
  googleLogin: {
    marginTop: theme.spacing(3),
    position: 'relative',
  },
  googleLoginProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

const LoginPage = React.memo(
  ({
    classes,
    login,
    createUserFromAccessToken,
    navigate,
    setUserProfileImageUrl,
  }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarVariant, setSnackbarVariant] = useState('success');

    const isLoginButtonDisabled = isLoggingIn || !email || !password;

    const handleGoogleLoginSuccess = async response => {
      setIsLoggingIn(true);
      await createUserFromAccessToken(
        response.accessToken,
        response.tokenObj.expires_in
      );
      setUserProfileImageUrl(response.profileObj.imageUrl);
      setIsLoggingIn(false);
    };

    const handleGoogleLoginFailure = ({ error, details }) => {
      console.log(error, details);
    };

    const handleSubmit = async event => {
      event.preventDefault();
      const { email, password } = event.target;
      try {
        await login(email.value, password.value);
        navigate('/');
      } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarMessage(error.message);
        setSnackbarVariant('error');
      }
    };

    const handleSnackbarClose = (_, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setIsSnackbarOpen(false);
    };

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              type="email"
              autoComplete="email"
              margin="normal"
              label="Email"
              id="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              name="email"
              fullWidth
            />
            <TextField
              type="password"
              autoComplete="password"
              margin="normal"
              label="Password"
              id="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              name="password"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoginButtonDisabled}
              className={classes.loginButton}
            >
              Login
            </Button>
            <Typography>
              or <Link to="/register">register</Link>
            </Typography>

            <GoogleLogin
              clientId="1052222050887-labkfk5agrcfn4dbfaf0qitjq635s5nv.apps.googleusercontent.com"
              icon={false}
              isSignedIn
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
              scope="https://www.googleapis.com/auth/calendar.events"
              render={props => (
                <div className={classes.googleLogin}>
                  <Button
                    onClick={props.onClick}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={isLoggingIn}
                  >
                    Google
                  </Button>
                  {isLoggingIn && (
                    <CircularProgress
                      size={24}
                      className={classes.googleLoginProgress}
                    />
                  )}
                </div>
              )}
            />
          </form>
        </Paper>
        <MessageSnackbar
          isOpen={isSnackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          variant={snackbarVariant}
        />
      </main>
    );
  }
);

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  createUserFromAccessToken: PropTypes.func.isRequired,
  setUserProfileImageUrl: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  login,
  createUserFromAccessToken,
  setUserProfileImageUrl,
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(LoginPage)
);
