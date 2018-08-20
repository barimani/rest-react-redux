import { combineReducers } from 'redux';
import { detailedEntityReducer, queriedEntityReducer } from '../../src/index';

const reducers = {
    contact: detailedEntityReducer('contact'),
    contacts: queriedEntityReducer('contact'),
};

export default combineReducers(reducers);
