import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import {detailedEntity} from "../src";

@detailedEntity('entity')
class Component extends React.Component {
    render() {
        return <div>test component</div>
    }
}

class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <Component/>
            </Provider>
        )
    }
}

export default App;
