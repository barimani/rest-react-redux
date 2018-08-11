import { combineReducers } from 'redux';
import { detailedEntityReducer } from '../src/index';

const reducers = {
    entity: detailedEntityReducer('entity'),
};

export default combineReducers(reducers);
