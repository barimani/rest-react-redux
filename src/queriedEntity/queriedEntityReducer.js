import * as types from './helpers';

const defaultState = {tracker: []};

export default entityName => (state = defaultState, action) => {
    switch (action.type) {
        case (types.INSERT_QUERY(entityName)): {
            return {...state, [action.payload.query]: action.payload};
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
            return {...state, tracker: [...tracker]};
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
            return {...state, [lastQuery]: newQueryData};
        }

        case (types.PATCH_ENTITY(entityName)): {
            const { tracker } = state;
            if (tracker.length === 0) return state;

            const lastQuery = tracker[tracker.length - 1];
            const lastQueryData = state[lastQuery];
            if (!lastQueryData) return state;

            const patchedFields = action.payload;
            const newQueryData = lastQueryData.map(data => {
                if (patchedFields.id === newQueryData.id) return {...data, ...patchedFields};
                return data;
            });
            return {...state, [lastQuery]: newQueryData};
        }

        case (types.DELETE_ENTITY(entityName)): {
            const { tracker } = state;
            if (tracker.length === 0) return state;

            const {resultField, entity} = action.payload;
            const lastQuery = tracker[tracker.length - 1];
            const lastQueryData = state[lastQuery];
            if (!lastQueryData) return state;

            const newQueryData = lastQueryData[resultField].filter(data => entity.id !== data.id);
            return {...state, [lastQuery]: newQueryData};
        }

        default:
            return state;
    }
}
