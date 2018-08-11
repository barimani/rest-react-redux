import { combineReducers } from 'redux';
import { detailedEntityReducer } from '../src/index';

const reducers = {
    contact: detailedEntityReducer('contact'),
};

export default combineReducers(reducers);
