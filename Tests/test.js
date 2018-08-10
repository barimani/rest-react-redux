import React from 'react';
import {expect} from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const Component = () => <div>hi</div>;

describe('Sanity', () => {
    it('checks 1 and 1 are equal', () => {
        expect(1).to.equal(1);
    });

    it('checks whether Component can be rendered', () => {
        const wrapper = shallow(<Component/>);
        expect(wrapper.find('div')).to.have.length(1);
    });
});