import { combineReducers } from 'redux';
import userReducer from './userReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
  userReducer,
  settingsReducer,
});
