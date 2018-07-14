export default (state = { user: null }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, { user: action.user });
    case 'SET_TOKEN':
      return Object.assign({}, state, { token: action.token });
    default:
      return state;
  }
};
