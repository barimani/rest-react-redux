import * as types from "./helpers";

const defaultState = {};

/**
 * Reducer generator for storing and to caching detailed items
 * @param itemName
 * @returns {function itemDetailRepo}
 */
export default itemName => function itemDetailRepo(state = defaultState, action) {
    switch (action.type) {
        case types.INSERT_ITEM(itemName): {
            const entity = action.payload;
            return {...state, [entity.id]: entity};
        }
        case types.UPDATE_ITEM(itemName): {
            const {entity, entityId} = action.payload;
            return {...state, [entityId]: entity};
        }
        case types.PATCH_ITEM(itemName): {
            const {entity, entityId} = action.payload;
            return {...state, [entityId]: {...state[entityId], ...entity}};
        }
        case types.REMOVE_ITEM(itemName): {
            const entityId = action.payload;
            return {...state, [entityId]: undefined};
        }
        default:
            return state;
    }
}
