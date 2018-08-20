/**
 * Detailed entity action type generators
 */
export const INSERT_ITEM = entityName => 'INSERT_' + entityName.toUpperCase();
export const UPDATE_ITEM = entityName => 'UPDATE_' + entityName.toUpperCase();
export const REMOVE_ITEM = entityName => 'REMOVE_' + entityName.toUpperCase();
export const PATCH_ITEM = entityName => 'PATCH_' + entityName.toUpperCase();
export const PUSH_TO_TRACKING_QUEUE_DETAILED = entityName => 'PUSH_TO_TRACKING_QUEUE_DETAILED_' + entityName.toUpperCase();


/**
 * Queried entity action type generators
 */
export const INSERT_QUERY = entityName => 'INSERT_QUERY_' + entityName.toUpperCase();
export const PUSH_TO_TRACKING_QUEUE = entityName => 'PUSH_TO_TRACKING_QUEUE_QUERY_' + entityName.toUpperCase();
export const UPDATE_NETWORK_TIMER = entityName => 'UPDATE_NETWORK_TIMER_' + entityName.toUpperCase();
export const UPDATE_ENTITY = entityName => 'UPDATE_ENTITY_' + entityName.toUpperCase();
export const PATCH_ENTITY = entityName => 'PATCH_ENTITY_' + entityName.toUpperCase();
export const DELETE_ENTITY = entityName => 'DELETE_ENTITY_' + entityName.toUpperCase();

/**
 *  Generates a unique key from url and query params
 *  @returns {number}
 */
export const encodeAPICall = (url, params) => {
    const sortedParams = {};
    Object.keys(params).sort().forEach(key => sortedParams[key] = params[key]);
    const string = JSON.stringify(sortedParams);
    return hashCode(url + string);
};

/**
 * A placeholder constant for signalling the loading status in redux to prevent re-call
 */
export const LOADING = 'LOADING';


/**
 * Generates a numerical hash from a string
 * @returns {number}
 */
const hashCode = string => {
        let hash = 0;
        if (string.length === 0) return hash;
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
};

/**
 * Capitalizes first letter of a word
 * @return {string}
 */
export const CFL = word => {
    if (!word) return word;
    return word.slice(0, 1).toUpperCase() + word.slice(1, word.length);
};

/**
 * Pluralizes a word
 * @return {string}
 */
export const PL = word => {
    if (!word || word.length === 0) return word;
    if (/(x|s|ch|sh)$/i.test(word)) return word + 'es';
    if (/y$/i.test(word)) return word.slice(0, word.length - 1) + 'ies';
    return word + 's';
};


/**
 * Constructs a detailed entity url by appending id after the base url
 * @returns {string}
 */
export const detailedUrl = (baseUrl, id) => {
    const hasTrailingSlash = baseUrl.endsWith('/');
    return baseUrl + (!hasTrailingSlash ? '/' : '') + id + (hasTrailingSlash ? '/' : '');
};