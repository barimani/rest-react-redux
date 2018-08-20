import {encodeAPICall} from "../src/helpers";

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .reduce((result, prop) => ({
            ...result,
            [prop]: Object.getOwnPropertyDescriptor(src, prop),
        }), {});
    Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
copyProps(window, global);




import React from 'react';
import {expect} from 'chai';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, {store} from './sampleTestApp/App';

Enzyme.configure({ adapter: new Adapter() });



const dummyHOC = WrappedComponent => class extends React.Component{
    render() {
        return <WrappedComponent/>
    }
};
const Component = () => <div>hi</div>;

/**
 * The following tests are by no means considered as 'unit tests'. The tests describe a story from top to bottom.
 * Skipping/modifying a story could cause any test after that to fail
 */


describe('Sanity', () => {
    it('checks 1 and 1 are equal', () => {
        expect(1).to.equal(1);
    });

    it('checks whether Component can be rendered', () => {
        const component = shallow(<Component/>);
        expect(component.find('div')).to.have.length(1);
    });

    it('can render a wrapped component and access the wrapped component', () => {
        const WrappedComponent = dummyHOC(Component);
        const wrapped = shallow(<WrappedComponent/>).first().shallow();
        expect(wrapped.find('div')).to.have.length(1);
    });

    it('can render a doubly wrapped component and access the wrapped component', () => {
        const WrappedComponent = dummyHOC(dummyHOC(Component));
        const wrapped = shallow(<WrappedComponent/>).first().shallow().first().shallow();
        expect(wrapped.find('div')).to.have.length(1);
    });

    it('can shallow a full App simulation', () => {
        const wrapped = shallow(<App/>);
        expect(wrapped.find('div')).to.have.length(1);
    });
});

describe('The example Contacts in App with detailedEntity decoration', () => {
    let contactDetail;
    let getProps;

    before(() => {
        // Create a sample wrapped component
        contactDetail = mount(<App/>).find('ContactDetail');
        getProps = () => contactDetail.instance().props;
    });

    it('should have a div and rest-react-redux methods injected as properties', () => {
        expect(contactDetail.find('div')).to.have.length(1);
        expect(getProps()).to.have.property('initialGetContact');
        expect(getProps()).to.have.property('updateContact');
    });

    it('is exposed to a store with an empty contact field', () => {
        expect(store.getState()).to.have.property('contact').that.is.an('object');
    });

    it('can call initialGetContact method from the test scope, update store and receive data', done => {
        getProps().initialGetContact('/contacts/1', '1').then(() => {
            expect(store.getState().contact).to.have.property('1').and.not.to.have.property('2');
            expect(getProps().contact).to.have.property('id').that.is.equal('1');
            done();
        })
    });

    it('can update the contact info and update store without re-getting', done => {
        getProps().updateContact({name: 'changed name'}).then(() => {
            expect(getProps().contact).to.have.property('id').that.is.equal('1');
            expect(getProps().contact).to.have.property('name').that.is.equal('changed name');
            done();
        })
    });

    it('can fetch via getContact and see that the data has not changed', done => {
        getProps().getContact().then(() => {
            expect(getProps().contact).to.have.property('name').that.is.equal('changed name');
            done();
        })
    });

    it('can remove the contact entity and reflect in the store', done => {
        getProps().deleteContact().then(() => {
            expect(store.getState().contact).to.not.have.property('1');
            expect(store.getState().contact.tracker).to.have.lengthOf(0);
            expect(getProps().contact).to.be.deep.equal({});
            done();
        })
    });

    it('can get the second contact entity', done => {
        getProps().initialGetContact('/contacts/2', '2').then(() => {
            expect(store.getState().contact).to.have.property('2');
            expect(store.getState().contact).to.not.have.property('1');
            expect(getProps().contact).to.have.property('id').that.is.equal('2');
            done();
        })
    });

    it('can get the third contact and store should remember the second contact as well', done => {
        getProps().initialGetContact('/contacts/3', '3').then(() => {
            expect(store.getState().contact).to.have.property('2');
            expect(store.getState().contact).to.have.property('3');
            expect(store.getState().contact.tracker).to.have.lengthOf(2);
            expect(getProps().contact).to.have.property('id').that.is.equal('3');
            done();
        })
    });

});

describe('The example ContactDetail in App with detailedEntity decoration', () => {
    let contacts;
    let getProps;

    before(() => {
        // Create a sample wrapped component
        contacts = mount(<App/>).find('Contacts');
        getProps = () => contacts.instance().props;
    });

    it('should have a div and rest-react-redux methods injected as properties', () => {
        expect(contacts.find('div')).to.have.length(1);
        expect(getProps()).to.have.property('initialQueryContacts');
        expect(getProps()).to.have.property('updateContact');
    });

    it('is exposed to a store with an empty contacts field', () => {
        expect(store.getState()).to.have.property('contacts').that.is.an('object');
    });

    it('can call initialQueryContacts method from the test scope, update store and receive data', done => {
        getProps().initialQueryContacts('/contacts', {page: 1, pageSize: 10}).then(() => {
            const hashedKey = encodeAPICall('/contacts', {page: 1, pageSize: 10});
            expect(store.getState().contacts).to.have.property(hashedKey);
            expect(getProps().contacts).to.have.lengthOf(10);
            expect(getProps().contactsQueryParams).to.be.deep.equal({page: 1, pageSize: 10});
            expect(getProps().contactsMetadata).to.have.property('totalItems').that.is.not.equal(0);
            expect(getProps().contactsMetadata).to.have.property('totalPages').that.is.not.equal(0);
            done();
        })
    });

    it('can perform a second query without losing the previous data', done => {
        getProps().queryContacts({page: 2}).then(() => {
            // Params updated correctly
            expect(getProps().contactsQueryParams).to.be.deep.equal({page: 2, pageSize: 10});
            expect(getProps().contacts).to.have.lengthOf(10);
            done();
        })
    });

    it('query with a different pageSize', done => {
        getProps().queryContacts({pageSize: 5}).then(() => {
            // Params updated correctly
            expect(getProps().contactsQueryParams).to.be.deep.equal({page: 2, pageSize: 5});
            expect(getProps().contacts).to.have.lengthOf(5);
            done();
        })
    });

    it('can update a single entity', done => {
        const targetContact =  getProps().contacts[0];
        targetContact.name = 'Changed name';
        getProps().updateContact(targetContact).then(() => {
            expect(getProps().contacts[0].name).to.equal('Changed name');
            done();
        })
    });

    it('can delete a single entity', done => {
        const targetContact =  getProps().contacts[0];
        getProps().deleteContact(targetContact).then(() => {
            expect(getProps().contacts[0].name).to.not.equal(targetContact.name);
            done();
        })
    });
});



