import React from 'react';
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

const mapDispatchToProps = dispatch => ({
  deleteUserAndLogout: () => dispatch(deleteUserAndLogout()),
});

export default connect(
  null,
  mapDispatchToProps
)(withAuth(SettingsPage));
