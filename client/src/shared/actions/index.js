export const setUser = user => dispatch => {
  dispatch({
    type: 'SET_USER',
    user,
  });
};

export const setSchedules = schedules => dispatch => {
  dispatch({
    type: 'SET_SCHEDULES',
    schedules,
  });
};
