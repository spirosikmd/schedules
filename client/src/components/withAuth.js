import React, { PureComponent, Fragment } from 'react';
import { checkToken } from '../api';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export default function withAuth(ComponentToProtect) {
  return class extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      checkToken()
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }

    render() {
      const { loading, redirect } = this.state;

      if (!loading) {
        if (redirect) {
          return (
            <Fragment>
              <Typography>
                Something went wrong! Logout and login again :)
              </Typography>
            </Fragment>
          );
        } else {
          return (
            <Fragment>
              <ComponentToProtect {...this.props} />
            </Fragment>
          );
        }
      }

      return (
        <Grid container justify="center" alignItems="center">
          <Fade in={loading} unmountOnExit>
            <CircularProgress />
          </Fade>
        </Grid>
      );
    }
  };
}
