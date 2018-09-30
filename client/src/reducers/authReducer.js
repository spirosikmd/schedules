export default (state = { user: null }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, { user: action.user });
    default:
      return state;
  }
};
