import React, { PureComponent } from 'react';
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
        .then(() => {
          this.setState({ loading: false });
        })
        .catch(() => {
          this.setState({ loading: false, redirect: true });
        });
    }

    render() {
      const { loading, redirect } = this.state;

      if (!loading) {
        if (redirect) {
          return (
            <Typography>
              Something went wrong! Logout and login again :)
            </Typography>
          );
        } else {
          return <ComponentToProtect {...this.props} />;
        }
      }

      return <Loader loading={loading} />;
    }
  };
}
