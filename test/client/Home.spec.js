const { expect } = require('chai');
import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import Home from '../../src/Home';
import Adapter from 'enzyme-adapter-react-15';
Enzyme.configure({ adapter: new Adapter()});

describe('Home', ()=> {
  it('displays the word home', ()=> {
    const home = shallow(<Home />);
    const div = home.find('div');
    console.log(div.html());
  });
});
