import React from 'react';
import { connect } from 'react-redux';
import {getItem, createItem, deleteItem, patchItem, pushToQueue, updateItem} from "./detailedEntityActions";
import {CFL} from "../helpers";

/**
 * Detailed entity abstraction (Higher Order Component)
 * Retrieves entityName, end point url. Dispatches queries and keeps track of the queries.
 * API contract: should accept page and pageSize as params, should return a json with the property item as list
 * This component will recycles cached queries after. It retains at most RETAIN_NUMBER of queries
 * Per entityName used, there must be a reducer with the same name located at reducers/index.js
 *
 * staticURL is a url provided at the annotation level and requires no logic to generate it i.e. no
 *    parameter exists inside it. If your url contains custom parameters (usually ids that component knows about it)
 *    use dynamicURL on the initialQuery. This will override the staticURL if any provided.
 */

// These props should be filtered before inject
const filteredProps = {};
['getItem', 'pushToQueue', 'createItem', 'updateItem', 'patchItem', 'deleteItem']
    .forEach(prop => filteredProps[prop] = undefined);

// Number of queries to cache in store
const RETAIN_NUMBER = 10;


export default (entityName, {reducerName, retain_number = RETAIN_NUMBER} = {}) => WrappedComponent =>
    connect(state => ({[entityName]: state[reducerName || entityName]}),
        {getItem, pushToQueue, createItem, updateItem, patchItem, deleteItem})(
        class extends React.Component {

            static defaultProps = {freeze: () => {}, unfreeze: () => {}};

            state = {entityId: null, loadingData: false};

            initialGet = (url, entityId) => {
                this.setState({loadingData: true, url, entityId});
                return this.get(url);
            };

            get = (url = this.state.url) => {
                this.props.freeze();
                this.setState({loadingData: true});
                return this.props.getItem(entityName, url)
                    .then(() => {this.setState({loadingData: false});this.props.unfreeze();this.collectGarbage();})
                    .catch(() => {this.setState({loadingData: false});this.props.unfreeze();});
            };

            // Checks whether initialGet is called and url is known
            checkSetup = () => {
                const { url, entityId } = this.state;
                if (!url) throw new Error(`No url specified for ${entityName}`);
                if (!entityId) throw new Error(`No entityId specified for ${entityName}`);
            };

            // Garbage collector so the redux storage will not blow up!
            collectGarbage = () => this.props.pushToQueue(entityName, this.state.entityId, retain_number);

            // Entity must contain id and the whole properties of the model
            update = entity => {
                this.checkSetup();
                this.props.freeze();
                return this.props.updateItem(entityName, entity, this.state.entityId, this.state.url)
                    .then(() => {
                        this.props.unfreeze();
                        this.get();
                    });
            };

            // The fields to be patched, field should contain id
            patch = fields => {
                this.checkSetup();
                this.props.freeze();
                return this.props.patchItem(entityName, fields, this.state.entityId, this.state.url)
                    .then(() => {
                        this.props.unfreeze();
                        this.get();
                    });
            };

            // Accepts the entity object that contains id or the id itself as a string
            delete = () => {
                this.checkSetup();
                this.props.freeze();
                return this.props.deleteItem(entityName, this.state.entityId, this.state.url)
                    .then(() => {
                        this.props.unfreeze();
                        this.get();
                    });
            };

            /** @ignore */
            render() {
                const {entityId} = this.state;
                const entity = this.props[entityName][entityId];
                const item = {[entityName]: entity || {}};
                const injectedProps = {
                    [entityName]: entity || {},
                    ['initialGet' + CFL(entityName)]: this.initialGet,
                    ['get' + CFL(entityName)]: this.get,
                    ['update' + CFL(entityName)]: this.update,
                    ['patch' + CFL(entityName)]: this.patch,
                    ['delete' + CFL(entityName)]: this.delete,
                    ['loading' + CFL(entityName)]: this.state.loadingData
                };
                return (
                    <WrappedComponent
                        {...this.props}
                        {...filteredProps}
                        {...item}
                        {...injectedProps}
                    />
                )
            }
        }
    );
