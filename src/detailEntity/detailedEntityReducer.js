import * as types from "./helpers";

const defaultState = {tracker: []};

/**
 * Reducer generator for storing and to caching detailed entities
 */
export default entityName => function itemDetailRepo(state = defaultState, action) {
    switch (action.type) {
        case types.INSERT_ITEM(entityName): {
            const entity = action.payload;
            return {...state, [entity.id]: entity};
        }
        case types.UPDATE_ITEM(entityName): {
            const {entity, entityId} = action.payload;
            return {...state, [entityId]: entity};
        }
        case types.PATCH_ITEM(entityName): {
            const {entity, entityId} = action.payload;
            return {...state, [entityId]: {...state[entityId], ...entity}};
        }
        case types.REMOVE_ITEM(entityName): {
            const entityId = action.payload;
            return {...state, [entityId]: undefined};
        }
        case (types.PUSH_TO_TRACKING_QUEUE_DETAILED(entityName)): {
            const tracker = [...state.tracker];
            const {id, retain_number} = action.payload;
            const index = tracker.indexOf(id);
            if (index > -1) tracker.splice(index, 1);
            else if (tracker.length >= retain_number) {
                delete state[tracker[0]];
                tracker.shift();
            }
            tracker.push(id);
            return {...state, tracker};
        }
        default:
            return state;
    }
}
