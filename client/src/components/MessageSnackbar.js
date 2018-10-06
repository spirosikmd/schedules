import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';

class MessageSnackbar extends PureComponent {
  render() {
    const { message, contentProps, isOpen, onClose } = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isOpen}
        autoHideDuration={4000}
        onClose={onClose}
        ContentProps={contentProps}
        message={message}
      />
    );
  }
}

MessageSnackbar.propTypes = {
  message: PropTypes.node,
  onClose: PropTypes.func,
};

MessageSnackbar.defaultProps = {
  onClose: () => {},
  contentProps: {},
  message: <span>Default message</span>,
  isOpen: false,
};

export default MessageSnackbar;
