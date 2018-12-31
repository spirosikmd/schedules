import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MessageSnackbarContent from './MessageSnackbarContent';

const MessageSnackbar = React.memo(({ message, variant, isOpen, onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={isOpen}
      autoHideDuration={4000}
      onClose={onClose}
    >
      <MessageSnackbarContent
        onClose={onClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
});

MessageSnackbar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired,
};

export default MessageSnackbar;
