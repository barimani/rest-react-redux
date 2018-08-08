import React from 'react';
import { connect } from 'react-redux';
import {encodeAPICall, PL} from "./helpers";
import {CFL} from "./helpers";
import {queryEntities, pushToQueue, createEntity, updateEntity, patchEntity, deleteEntity} from './queriedEntityActions';

/**
 * Queried entity abstraction (Higher Order Component)
 * Retrieves entityName, end point url and params. Dispatches queries and keeps track of the queries.
 * This component will recycles cached queries after. It retains at most RETAIN_NUMBER of queries
 * Per entityName used, there must be a reducer with the same name located at reducers/index.js
 */

// Default number of queries to cache in store
const RETAIN_NUMBER = 10;

// Default field that maps the results in the response body, if set to null, the whole response will be returned;
const RESULT_FIELD = 'content';


const filteredProps = {};
['queryEntities', 'pushToQueue', 'createItem',
    'updateItem', 'patchItem', 'deleteItem'].forEach(prop => filteredProps[prop] = undefined);

export default (entityName, {resultField = RESULT_FIELD, hideLoadIfDataFound = true,
    retain_number = RETAIN_NUMBER, reducer_name} = {}) =>
    WrappedComponent =>
        connect(state => ({[PL(entityName)]: state[reducer_name || PL(entityName)]}),
            {queryEntities, pushToQueue, createEntity, updateEntity, patchEntity, deleteEntity})(
            class extends React.Component {

                static defaultProps = {freeze: () => {}, unfreeze: () => {}};

                state = {params: {}, loadingData: false};

                // Sets up the query and makes the initial query
                initialQuery = (url, params = {}) => {
                    this.setState({url});
                    this.query(params, url);
                };

                // Queries with the params, will construct query params based on the old ones and new ones
                query = (params = this.state.params, url = this.state.url) => {
                    const oldParams = {...this.state.params};
                    const newParams = {...oldParams, ...params};
                    this.setState({params: newParams, loadingData: true});
                    const dataExists = !!this.props[PL(entityName)][encodeAPICall(url, newParams)];
                    if (!dataExists || !hideLoadIfDataFound) this.props.freeze();
                    this.props.queryEntities(entityName, url, newParams,
                        () => {this.setState({loadingData: false});this.props.unfreeze();this.collectGarbage(url, newParams);},
                        () => {this.setState({loadingData: false, params: oldParams});this.props.unfreeze();});
                };

                // Checks whether initialQuery is called and url is known
                checkSetup = () => {
                    const { url } = this.state;
                    if (!url) throw new Error(`No url specified for ${entityName}`);
                };

                // this entity does not contain id
                create = entity => {
                    this.checkSetup();
                    this.props.freeze();
                    this.props.createEntity(entityName, entity, this.state.url, () => {
                        this.props.unfreeze();
                        this.query()
                    });
                };

                // Entity must contain id and the whole properties of the model
                update = entity => {
                    this.checkSetup();
                    this.props.freeze();
                    this.props.updateEntity(entityName, entity, this.state.url, resultField, () => {
                        this.props.unfreeze();
                        this.query()
                    });
                };

                // The fields to be patched, field should contain id
                patch = fields => {
                    this.checkSetup();
                    this.props.freeze();
                    this.props.patchEntity(entityName, fields, this.state.url, resultField, () => {
                        this.props.unfreeze();
                        this.query()
                    });
                };

                // Accepts the entity object that contains id or the id itself as a string
                delete = entity => {
                    this.checkSetup();
                    if (typeof entity === 'string') entity = {id: entity};
                    this.props.freeze();
                    this.props.deleteEntity(entityName, entity, this.state.url, resultField, () => {
                        this.props.unfreeze();
                        this.query()
                    });
                };

                // Garbage collector so the redux storage will not blow up!
                collectGarbage = (url, params) => this.props.pushToQueue(entityName, encodeAPICall(url, params), retain_number);

                render() {
                    const {url, params} = this.state;
                    const queryData = this.props[PL(entityName)][encodeAPICall(url, params)] || {};
                    const queryMetadata = resultField ? {...queryData} : undefined;
                    if (resultField) delete queryMetadata[resultField];
                    const injectedProps = {
                        [PL(entityName)]: (resultField ? (queryData && queryData[resultField]) : queryData) || [],
                        [PL(entityName) + 'Metadata']: queryMetadata,
                        ['initialQuery' + CFL(PL(entityName))]: this.initialQuery,
                        ['query' + CFL(PL(entityName))]: this.query,
                        ['create' + CFL(entityName)]: this.create,
                        ['update' + CFL(entityName)]: this.update,
                        ['patch' + CFL(entityName)]: this.patch,
                        ['delete' + CFL(entityName)]: this.delete,
                        ['loading' + CFL(PL(entityName))]: this.state.loadingData
                    };
                    return (
                        <WrappedComponent
                            {...this.props}
                            {...filteredProps}
                            {...this.state.params}
                            {...injectedProps}
                        />
                    )
                }
            }
        );