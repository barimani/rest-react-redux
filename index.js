'use strict';

var lib = require('./dist/index');

// Reducer
Object.defineProperty(exports , 'queriedEntityReducer', {
    value: lib.queriedEntityReducer
});

// HOC
Object.defineProperty(exports , 'queriedEntity', {
    value: lib.queriedEntity
});

// Reducer
Object.defineProperty(exports , 'detailedEntityReducer', {
    value: lib.detailedEntityReducer
});

// HOC
Object.defineProperty(exports , 'detailedEntity', {
    value: lib.detailedEntity
});

// Action
Object.defineProperty(exports , 'queryEntities', {
    value: lib.queryEntities
});

// Action
Object.defineProperty(exports , 'getDetailedEntity', {
    value: lib.getDetailedEntity
});
