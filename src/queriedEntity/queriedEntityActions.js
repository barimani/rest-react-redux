import {detailedUrl, encodeAPICall, LOADING} from "../helpers";
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
    return {
        type: types.DELETE_ENTITY(entityName),
        payload
    };
};

const updateNetworkTimer = (payload, entityName) => {
    return {
        type: types.UPDATE_NETWORK_TIMER(entityName),
        payload
    };
};

export const queryEntities = (entityName, url, params, hasData = false, setPreloadFlag = false, smartPreload = false) => {
    return dispatch => {
        const query = encodeAPICall(url, params);

        hasData && dispatch(insertQuery({LOADING, query}, entityName));

        let time;
        if (smartPreload) time = new Date();

        return axios.get(url, {params}).then(({data}) => {

            if (smartPreload) {
                const timeDiff = (new Date() - time);
                dispatch(updateNetworkTimer(timeDiff, entityName))
            }

            const payload = setPreloadFlag ? {...data, query, preloadedAt: new Date()} : {...data, query};
            dispatch(insertQuery(payload, entityName));
        });
    }
};

export const pushToQueue = (entityName, key, retain_number) => {
    return {
        type: types.PUSH_TO_TRACKING_QUEUE(entityName),
        payload: {key, retain_number}
    };
};

export const createEntity = (entityName, entity, url) => {
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
