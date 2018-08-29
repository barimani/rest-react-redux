import {detailedUrl, encodeAPICall} from "../helpers";
import axios from "axios";
import * as types from "../helpers";

/**
 * Actions
 */
const insertQuery = (payload, entityName) => {
    return {
        type: types.INSERT_QUERY(entityName),
        payload
    };
};

const updateEntityDispatch = (payload, entityName) => {
    return {
        type: types.UPDATE_ENTITY(entityName),
        payload
    };
};

export const patchEntityDispatch = (payload, entityName) => {
    return {
        type: types.PATCH_ENTITY(entityName),
        payload
    };
};

const deleteEntityDispatch = (payload, entityName) => {
    let type = types.DELETE_ENTITY(entityName);
    return {
        type: type,
        payload
    };
};

export const queryEntities = (entityName, url, params, resultField) => {
    return dispatch => axios.get(url, {params})
        .then(({data}) => {
            // Checking the existence of data
            if (!data[resultField]) console.warn(`No data found for ${entityName} at property ${resultField}.
Please verify your API response schema`);
            dispatch(insertQuery({...data, query: encodeAPICall(url, params)}, entityName));
        });
};

export const pushToQueue = (entityName, key, retain_number) => {
    return {
        type: types.PUSH_TO_TRACKING_QUEUE(entityName),
        payload: {key, retain_number}
    };
};

export const createEntity = (entityName, entity, url, onSuccess, onFailure) => {
    // The returned data will not be of any special use since the position it is placed in db is unknown
    // therefore no dispatch is made to store
    return () => axios.post(url, entity);
};

export const updateEntity = (entityName, entity, url, resultField) => {
    if (!entity.id) throw new Error(`Entity ${entityName} does not have id to update`);
    return dispatch => axios.put(detailedUrl(url, entity.id), entity)
        .then(({}) => {
            dispatch(updateEntityDispatch({entity, resultField}, entityName));
        });
};

export const patchEntity = (entityName, entity, url, resultField) => {
    if (!entity.id) throw new Error(`Entity ${entityName} does not have id to patch`);
    return dispatch => axios.patch(detailedUrl(url, entity.id), entity)
        .then(() => {
            dispatch(patchEntityDispatch({entity, resultField}, entityName));
        });
};

export const deleteEntity = (entityName, entity, url, resultField) => {
    if (!entity.id) throw new Error(`Entity ${entityName} does not have id to delete`);
    return dispatch => axios.delete(detailedUrl(url, entity.id))
        .then(() => {
            dispatch(deleteEntityDispatch({entity, resultField}, entityName));
        });
};
