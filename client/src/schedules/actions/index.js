export const setSchedules = schedules => dispatch => {
  dispatch({
    type: 'SET_SCHEDULES',
    schedules,
  });
};
