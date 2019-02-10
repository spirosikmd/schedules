import { combineReducers } from 'redux';
import authReducer from './shared/reducers';
import schedulesReducer from './schedules/reducers';

export default combineReducers({
  authReducer,
  schedulesReducer,
});
