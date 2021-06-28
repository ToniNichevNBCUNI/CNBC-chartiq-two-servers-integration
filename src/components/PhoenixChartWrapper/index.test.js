/* eslint-disable no-global-assign */
import PhoenixChartwrapper from './index';

describe('PhoenixChartwrapper', () => {

  it('Render web component', () => {
    const wrapper = shallow(<PhoenixChartwrapper />);
    expect( wrapper.find('[data-test="PhoenixChartWrapper"]').hasClass('chartiqAppWrapper') ).toEqual(false);
    expect( wrapper.find('[data-test="PhoenixChartWrapper"]').hasClass('chartiqWebWrapper') ).toEqual(true);
  });

  it('Render app component', () => {
    const wrapper = shallow(<PhoenixChartwrapper appChart />);
    expect( wrapper.find('[data-test="PhoenixChartWrapper"]').hasClass('chartiqAppWrapper') ).toEqual(true);
    expect( wrapper.find('[data-test="PhoenixChartWrapper"]').hasClass('chartiqWebWrapper') ).toEqual(false);

  });


  it('document is defined', () => {
    document = {};
    const wrapper = shallow(<PhoenixChartwrapper />);
    expect( wrapper.find('[data-test="PhoenixChartWrapper"]').hasClass('chartiqAppWrapper') ).toEqual(false);
    expect( wrapper.find('[data-test="PhoenixChartWrapper"]').hasClass('chartiqWebWrapper') ).toEqual(true);
  });
});
