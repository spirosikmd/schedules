import React, { PureComponent, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import { checkToken } from '../api';
import Loader from './Loader';

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

      return <Loader loading={loading} />;
    }
  };
}
