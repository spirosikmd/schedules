import { combineReducers } from 'redux';
import authReducer from './authReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
  authReducer,
  settingsReducer,
});
