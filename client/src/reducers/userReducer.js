export default (state = { user: null }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.user,
      };
    default:
      return state;
  }
};
