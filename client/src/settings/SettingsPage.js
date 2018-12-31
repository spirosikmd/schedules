import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import DeleteUserDialog from './DeleteUserDialog';
import { deleteUser } from '../actions/authActions';

const SettingsPage = React.memo(({ deleteUser }) => {
  const handleDeleteClick = async () => {
    await deleteUser();
    navigate('/');
  };

  return <DeleteUserDialog onDeleteClick={handleDeleteClick} />;
});

const mapDispatchToProps = dispatch => ({
  deleteUser: () => dispatch(deleteUser()),
});

export default connect(
  null,
  mapDispatchToProps
)(SettingsPage);
