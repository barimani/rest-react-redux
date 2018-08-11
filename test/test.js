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
import App, {store} from './App';

Enzyme.configure({ adapter: new Adapter() });



const dummyHOC = WrappedComponent => class extends React.Component{
    render() {
        return <WrappedComponent/>
    }
};
const Component = () => <div>hi</div>;

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
        expect(wrapped.find('div')).to.have.length(0);
    });
});

describe('Fully mounted App', () => {
    let contactDetail;
    let getProps;

    before(() => {
        // Create a sample wrapped component
        contactDetail = mount(<App/>).find('ContactDetail');
        getProps = () => contactDetail.instance().props;
    });

    it('can fully mount the App component', () => {
        expect(contactDetail.find('div')).to.have.length(1);
        expect(contactDetail.props()).to.have.property('initialGetContact');
    });

    it('has a store with an empty contact field', () => {
        expect(store.getState()).to.have.property('contact').that.is.an('object')
            .and.is.deep.equal({tracker: []});
    });

    it('can call a intialGet[EntityName] method from the test scope and receive data', done => {
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

    it('can fetch via getContact and see that the data is actually updated', done => {
        getProps().getContact().then(() => {
            expect(getProps().contact).to.have.property('name').that.is.equal('changed name');
            done();
        })
    });

    it('can remove the contact entity', done => {
        getProps().deleteContact().then(() => {
            expect(getProps().contact).to.be.deep.equal({});
            done();
        })
    });

    it('can get the second contact entity', done => {
        getProps().initialGetContact('/contacts/2', '2').then(() => {
            expect(store.getState().contact).to.have.property('2').and.not.to.have.property('1');
            expect(getProps().contact).to.have.property('id').that.is.equal('2');
            done();
        })
    });

});



