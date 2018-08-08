/** Queried entity actions **/
export const INSERT_QUERY = entityName => 'INSERT_QUERY_' + entityName.toUpperCase();
export const PUSH_TO_TRACKING_QUEUE = entityName => 'PUSH_TO_TRACKING_QUEUE_QUERY_' + entityName.toUpperCase();
export const UPDATE_ENTITY = entityName => 'UPDATE_ENTITY_' + entityName.toUpperCase();
export const PATCH_ENTITY = entityName => 'PATCH_ENTITY_' + entityName.toUpperCase();
export const DELETE_ENTITY = entityName => 'DELETE_ENTITY_' + entityName.toUpperCase();

// Generates a unique key from the params objects
export const encodeParams = (params) => {
    const sortedParams = {};
    Object.keys(params).sort().forEach(key => sortedParams[key] = params[key]);
    const string = JSON.stringify(sortedParams);
    return string.replace(/["{}]/g, '').replace(/,/g, '-');
};

// Capitalizes first letter
export const CFL = word => {
    if (!word) return word;
    return word.slice(0, 1).toUpperCase() + word.slice(1, word.length);
};

// Pluralizes the word
export const PL = word => {
    if (!word || word.length === 0) return word;
    if (/(x|s|ch|sh)$/i.test(word)) return word + 'es';
    if (/y$/i.test(word)) return word.slice(0, word.length - 1) + 'ies';
    return word + 's';
};

// Appends id after the base url
export const detailedUrl = (baseUrl, id) => {
    const hasSlash = baseUrl.endsWith('/');
    return baseUrl + (!hasSlash ? '/' : '') + id;
};