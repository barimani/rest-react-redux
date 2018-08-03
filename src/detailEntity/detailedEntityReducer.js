import * as types from "./helpers";

const defaultState = {};

/**
 * Reducer generator for storing and to caching detail items
 * @param itemName
 * @returns {function itemDetailRepo}
 */
export default itemName => function itemDetailRepo(state = defaultState, action) {
    switch (action.type) {
        case types.INSERT_ITEM(itemName): {
            const item = action.payload;
            return {...state, [item.id]: item};
        }
        case types.PATCH_ITEM(itemName): {
            const {id, field, newValue} = action.payload;
            const updatedItem = {...state[id], [field]: newValue};
            return {...state, [id]: updatedItem};
        }
        default:
            return state;
    }
}
