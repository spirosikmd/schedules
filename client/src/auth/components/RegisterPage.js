import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { register } from '../actions';
import MessageSnackbar from '../../shared/components/MessageSnackbar';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
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
  registerButton: {
    marginTop: theme.spacing(3),
  },
});

const RegisterPage = React.memo(({ classes, register, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('success');

  const isRegisterButtonDisabled =
    isRegistering || !email || !password || !confirmPassword;

  const handleSubmit = async event => {
    event.preventDefault();
    const { email, password, confirmPassword } = event.target;
    setIsRegistering(true);
    try {
      await register(email.value, password.value, confirmPassword.value);
      navigate('/login');
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarMessage(error.message);
      setSnackbarVariant('error');
    }
    setIsRegistering(false);
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
        <Typography variant="h5">Register</Typography>
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
          <TextField
            type="password"
            autoComplete="password"
            margin="normal"
            label="Confirm password"
            id="confirm-password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            name="confirmPassword"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isRegisterButtonDisabled}
            className={classes.registerButton}
          >
            Register
          </Button>
        </form>
        <Typography>
          or <Link to="/login">login</Link>
        </Typography>
      </Paper>
      <MessageSnackbar
        isOpen={isSnackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        variant={snackbarVariant}
      />
    </main>
  );
});

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  register,
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(RegisterPage)
);
