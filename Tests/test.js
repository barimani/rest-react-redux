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
import App from './App';

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

    it('can fully mount App in JSDOM environment', () => {
        const wrapped = mount(<App/>).find('ContactDetail');
        expect(wrapped.find('div')).to.have.length(1);
        expect(wrapped.props()).to.have.property('getContact');
        expect(wrapped.props()).to.have.property('updateContact');
    });
});