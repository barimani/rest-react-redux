import React from 'react';
import axios from "axios";
import * as types from "./helpers";
import { connect } from 'react-redux';

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

// Number of queries to cache in store
const RETAIN_NUMBER = 10;


export default (entityName) => WrappedComponent =>
    connect(state => ({[entityName]: state[entityName]}), {getItem})(
        class extends React.Component {

            static defaultProps = {freeze: () => {}, unfreeze: () => {}};
            state = {entityId: null, loadingData: false};

            initialGet = (url, entityId) => {
                this.setState({loadingData: true, url, entityId});
                this.props.freeze();
                this.props.getItem(entityName, url,
                    () => {this.setState({loadingData: false});this.props.unfreeze();this.collectGarbage();},
                    () => {this.setState({loadingData: false});this.props.unfreeze();});
            };

            collectGarbage = () => {

                // TODO garbage collection should be smarter, here is only a naive implementation

            };

            refetch = () => {
                this.props.freeze();
                this.setState({loadingData: true});
                this.props.getItem(entityName, this.state.url,
                    () => {this.setState({loadingData: false});this.props.unfreeze();this.collectGarbage();},
                    () => {this.setState({loadingData: false});this.props.unfreeze();});
            };

            /** @ignore */
            render() {
                const {entityId} = this.state;
                const entity = this.props[entityName][entityId];
                const item = {[entityName]: entity || {}};
                return (
                    <div>
                        <WrappedComponent
                            {...this.props}
                            {...item}
                            initialGet={this.initialGet}
                            refetch={this.refetch}
                        />
                    </div>
                )
            }
        }
    );


/**
 * actions
 */
const insertItem = (payload, entityName) => {
    return {
        type: types.INSERT_ITEM(entityName),
        payload
    };
};

const getItem = (entityName, url, onSuccess, onFailure) => {
    return dispatch => axios.get(url)
        .then(({data}) => {
            dispatch(insertItem(data, entityName));
            onSuccess && onSuccess();
        })
        .catch(() => {
            onFailure && onFailure();
        });
};