export default (state = { schedules: [] }, action) => {
  switch (action.type) {
    case 'SET_SCHEDULES':
      return {
        ...state,
        schedules: [...action.schedules],
      };
    default:
      return state;
  }
};
