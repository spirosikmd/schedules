import { fetchSettings, updateSettings } from '../api';

export const fetchSettingsForUser = email => dispatch => {
  return fetchSettings(email).then(settings => {
    dispatch(setSettings(settings));
  });
};

export const updateSettingsForUser = (
  email,
  settingsId,
  person
) => dispatch => {
  return updateSettings(email, settingsId, person).then(settings => {
    dispatch(setSettings(settings));
  });
};

export const setSettings = settings => dispatch => {
  dispatch({
    type: 'SET_SETTINGS',
    settings,
  });
};
