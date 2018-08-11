import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import {detailedEntity} from "../src";

@detailedEntity('contact')
class ContactDetail extends React.Component {
    render() {
        return <div>test component</div>
    }
}

class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <ContactDetail/>
            </Provider>
        )
    }
}

export default App;
