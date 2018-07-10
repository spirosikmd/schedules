export default (state = { settings: null }, action) => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { settings: action.settings };
    default:
      return state;
  }
};
