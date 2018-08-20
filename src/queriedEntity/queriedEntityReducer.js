import * as types from '../helpers';

const defaultState = {tracker: [], networkTimer: {average: 0, numberOfCalls: 0}};

/**
 * Reducer generator for storing and to caching queried entities
 */
export default entityName => (state = defaultState, action) => {
    switch (action.type) {
        case (types.INSERT_QUERY(entityName)): {
            return {...state, [action.payload.query]: action.payload};
        }
        case (types.UPDATE_NETWORK_TIMER(entityName)): {
            const {average, numberOfCalls} = state.networkTimer;
            // Cumulative averaging
            const newAverage = (average * numberOfCalls + action.payload) / (numberOfCalls + 1);
            const newNumberOfCalls = numberOfCalls + 1;
            const networkTimer = {average: newAverage, numberOfCalls: newNumberOfCalls};
            return {...state, networkTimer};
        }
        case (types.PUSH_TO_TRACKING_QUEUE(entityName)): {
            let tracker = [...state.tracker];
            const {key, retain_number} = action.payload;
            const index = tracker.indexOf(key);
            if (index > -1) tracker.splice(index, 1);
            else if (tracker.length >= retain_number) {
                delete state[tracker[0]];
                tracker.shift();
            }
            tracker.push(key);
            return {...state, tracker};
        }

        case (types.UPDATE_ENTITY(entityName)): {
            const { tracker } = state;
            if (tracker.length === 0) return state;

            const lastQuery = tracker[tracker.length - 1];
            const lastQueryData = state[lastQuery];
            if (!lastQueryData) return state;
            const {entity, resultField} = action.payload;
            const newQueryData = lastQueryData[resultField].map(data => {
                if (entity.id === data.id) return entity;
                return data;
            });
            return {...state, [lastQuery]: {...lastQueryData, [resultField]: newQueryData}};
        }

        case (types.PATCH_ENTITY(entityName)): {
            const { tracker } = state;
            if (tracker.length === 0) return state;

            const lastQuery = tracker[tracker.length - 1];
            const lastQueryData = state[lastQuery];
            if (!lastQueryData) return state;

            const {entity, resultField} = action.payload;
            const newQueryData = lastQueryData.map(data => {
                if (entity.id === newQueryData.id) return {...data, ...entity};
                return data;
            });
            return {...state, [lastQuery]: {...lastQueryData, [resultField]: newQueryData}};
        }

        case (types.DELETE_ENTITY(entityName)): {
            const { tracker } = state;
            if (tracker.length === 0) return state;

            const {resultField, entity} = action.payload;
            const lastQuery = tracker[tracker.length - 1];
            const lastQueryData = state[lastQuery];
            if (!lastQueryData) return state;

            const newQueryData = lastQueryData[resultField].filter(data => entity.id !== data.id);
            return {...state, [lastQuery]: {...lastQueryData, [resultField]: newQueryData}};
        }

        default:
            return state;
    }
}
