import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import {detailedEntity, queriedEntity} from "../../src/index";
import mockServer from './mock-adapter';
mockServer();

@detailedEntity('contact')
class ContactDetail extends React.Component {
    render() {
        return <div>test component</div>
    }
}

@queriedEntity('contact')
class Contacts extends React.Component {
    render() {
        return <div>test component</div>
    }
}

class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <div>
                    <ContactDetail/>
                    <Contacts/>
                </div>
            </Provider>
        )
    }
}

export default App;
export {store};
