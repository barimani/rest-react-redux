import {detailedUrl, encodeParams} from "./helpers";
import axios from "axios";
import * as types from "./helpers";

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

export const getItem = (entityName, url, onSuccess, onFailure) => {
    return dispatch => axios.get(url)
        .then(({data}) => {
            dispatch(insertItem(data, entityName));
            onSuccess && onSuccess();
        })
        .catch(() => {
            onFailure && onFailure();
        });
};

export const pushToQueue = (entityName, key, retain_number) => {
    return {
        type: types.PUSH_TO_TRACKING_QUEUE(entityName),
        payload: {key, retain_number}
    };
};

export const createItem = (entityName, entity, url, onSuccess, onFailure) => {
    return dispatch => axios.post(url, entity)
        .then(() => {
            // The returned data will not be of any special use since the position it is placed in db is unknown
            // therefore no dispatch is made to store
            onSuccess && onSuccess();
        }).catch(() => {
            onFailure && onFailure();
        });
};

export const updateItem = (entityName, entity, entityId, url, onSuccess, onFailure) => {
    return dispatch => axios.put(url, entity)
        .then(({}) => {
            dispatch(updateItemDispatch({entityId, entity}, entityName));
            onSuccess && onSuccess();
        }).catch((e) => {
            onFailure && onFailure();
            console.log(e);
        });
};

export const patchItem = (entityName, entity, entityId, url, onSuccess, onFailure) => {
    if (!entity.id) throw new Error(`Entity ${entityName} does not have id to patch`);
    return dispatch => axios.patch(url, entity)
        .then(() => {
            dispatch(patchItemDispatch({entity, entityId}, entityName));
            onSuccess && onSuccess();
        }).catch((e) => {
            onFailure && onFailure();
            console.log(e);
        });
};

export const deleteItem = (entityName, entityId, url, onSuccess, onFailure) => {
    return dispatch => axios.delete(url)
        .then(() => {
            dispatch(deleteItemDispatch(entityId, entityName));
            onSuccess && onSuccess();
        }).catch((e) => {
            onFailure && onFailure();
            console.log(e);
        });
};
