import axios from "axios";
import * as types from "../helpers";

/**
 * Actions
 */
const updateItemDispatch = (payload, entityName) => {
    return {
        type: types.UPDATE_ITEM(entityName),
        payload
    };
};

export const patchItemDispatch = (payload, entityName) => {
    return {
        type: types.PATCH_ITEM(entityName),
        payload
    };
};

const deleteItemDispatch = (payload, entityName) => {
    let type = types.REMOVE_ITEM(entityName);
    return {
        type: type,
        payload
    };
};


const insertItem = (payload, entityName) => {
    return {
        type: types.INSERT_ITEM(entityName),
        payload
    };
};

export const getItem = (entityName, url) => {
    return dispatch => axios.get(url).then(({data}) => {
        dispatch(insertItem(data, entityName));
    });
};

export const pushToQueue = (entityName, id, retain_number) => {
    return {
        type: types.PUSH_TO_TRACKING_QUEUE_DETAILED(entityName),
        payload: {id, retain_number}
    };
};

export const createItem = (entityName, entity, url) => {
    // The returned data will not be of any special use since the position it is placed in db is unknown
    // therefore no dispatch is made to store
    return () => axios.post(url, entity);
};

export const updateItem = (entityName, entity, entityId, url) => {
    return dispatch => axios.put(url, entity).then(() => {
        dispatch(updateItemDispatch({entityId, entity}, entityName));
    });
};

export const patchItem = (entityName, entity, entityId, url) => {
    return dispatch => axios.patch(url, entity).then(() => {
        dispatch(patchItemDispatch({entity, entityId}, entityName));
    });
};

export const deleteItem = (entityName, entityId, url) => {
    return dispatch => axios.delete(url).then(() => {
        dispatch(deleteItemDispatch(entityId, entityName));
    });
};
