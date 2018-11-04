import { fetchSettings, updateSettings } from '../api';

export const fetchSettingsForUser = email => async dispatch => {
  const settings = await fetchSettings(email);
  dispatch(setSettings(settings));
};

export const updateSettingsForUser = (
  email,
  settingsId,
  person
) => async dispatch => {
  const settings = await updateSettings(email, settingsId, person);
  dispatch(setSettings(settings));
};

export const setSettings = settings => dispatch => {
  dispatch({
    type: 'SET_SETTINGS',
    settings,
  });
};
