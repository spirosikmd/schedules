import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import DeleteUserDialog from './DeleteUserDialog';
import { deleteUserAndLogout } from '../actions';
import withAuth from '../../shared/components/withAuth';

const SettingsPage = React.memo(({ deleteUser: deleteUserAndLogout }) => {
  const handleDeleteClick = async () => {
    await deleteUserAndLogout();
    navigate('/');
  };

  return <DeleteUserDialog onDeleteClick={handleDeleteClick} />;
});

SettingsPage.propTypes = {
  deleteUserAndLogout: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  deleteUserAndLogout,
};

export default connect(
  null,
  mapDispatchToProps
)(withAuth(SettingsPage));
