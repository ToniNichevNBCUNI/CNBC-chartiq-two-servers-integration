import { CIQ } from 'chartiq/js/chartiq';
import getChartInitParams from './getChartInitParams';
import setUpChartConfig from './setupChartConfig';

import config from '../__mocks__/mockConfig';
import commonUSStock from '../__mocks__/commonStock.json';
import mutualFund from '../__mocks__/mutualFund.json';
import exchangeTradedFund from '../__mocks__/etf.json';
import FTSE from '../__mocks__/FTSE.json';

const fs = require('fs');
const path = require('path');

const jQueryFile = fs.readFileSync(path.resolve(__dirname, '../__mocks__/jquery.js'), { encoding: 'utf-8' });

describe('getChartInitParams', () => {
  let test1;
  let test2;

  beforeAll(() => {
    // load the scripts
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = jQueryFile; // add jQuery file
    window.document.body.appendChild(scriptEl);
  });

  it('should return expected chart params for us stocks', () => {
    const updatedConfig = setUpChartConfig(commonUSStock, config);
    const chartEngine = new CIQ.ChartEngine({
      container: document.querySelector('body'),
      ...updatedConfig
    });
    chartEngine.chart.market.normalHours = [
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
    ];
    chartEngine.extendedHours = {
      set: jest.fn()
    };
    chartEngine.chart.market.getOpen = () => new Date(2020, 7, 3, 9, 30, 0);
    const date = new Date(2020, 7, 3, 10, 30, 0);
    const expectedChartParams = {
      span: { base: 'today', multiplier: 1 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    const chartParams = getChartInitParams(commonUSStock, chartEngine, test1, test2, false, date);
    expect(chartParams).toStrictEqual(expectedChartParams);
  });


  it('should return expected chart params for pre market us stocks mon morning', () => {
    const updatedConfig = setUpChartConfig(commonUSStock, config);
    const chartEngine = new CIQ.ChartEngine({
      container: document.querySelector('body'),
      ...updatedConfig
    });
    chartEngine.chart.market.normalHours = [
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
    ];
    chartEngine.extendedHours = {
      set: jest.fn()
    };
    chartEngine.chart.market.getOpen = () => new Date(2020, 7, 3, 9, 30, 0);
    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    const date = new Date(2020, 7, 3, 7, 30, 0);
    const chartParams = getChartInitParams(commonUSStock, chartEngine, test1, test2, false, date);
    expect(chartParams).toStrictEqual(expectedChartParams);
  });
  it('should return expected chart params for us stocks since not market day', () => {
    const updatedConfig = setUpChartConfig(commonUSStock, config);
    const chartEngine = new CIQ.ChartEngine({
      container: document.querySelector('body'),
      ...updatedConfig
    });
    chartEngine.chart.market.normalHours = [
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
    ];
    chartEngine.extendedHours = {
      set: jest.fn()
    };
    chartEngine.chart.market.isMarketDay = () => false;

    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    const chartParams = getChartInitParams(commonUSStock, chartEngine, test1, test2);
    expect(chartParams).toStrictEqual(expectedChartParams);
  });

  it('should return expected chart params for mutual funds', () => {
    const updatedConfig = setUpChartConfig(mutualFund, config);
    const chartEngine = new CIQ.ChartEngine({
      container: document.querySelector('body'),
      ...updatedConfig
    });
    chartEngine.chart.market.normalHours = [
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
    ];
    chartEngine.extendedHours = {
      set: jest.fn()
    };

    const expectedChartParams = {
      span: { base: 'year', multiplier: 1 },
      periodicity: { period: 1, interval: 1, timeUnit: 'day' }
    };
    const chartParams = getChartInitParams(mutualFund, chartEngine, test1, test2);
    expect(chartParams).toStrictEqual(expectedChartParams);
  });

  it('should return expected chart params for mutual funds', () => {
    const updatedConfig = setUpChartConfig(exchangeTradedFund, config);
    const chartEngine = new CIQ.ChartEngine({
      container: document.querySelector('body'),
      ...updatedConfig
    });
    chartEngine.chart.market.normalHours = [
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
    ];
    chartEngine.extendedHours = {
      set: jest.fn()
    };

    const expectedChartParams = {
      span: { base: 'year', multiplier: 1 },
      periodicity: { period: 1, interval: 1, timeUnit: 'day' }
    };
    const chartParams = getChartInitParams(exchangeTradedFund, chartEngine, test1, test2);
    expect(chartParams).toStrictEqual(expectedChartParams);
  });

  it('should return expected chart params for FTSE', () => {
    const updatedConfig = setUpChartConfig(FTSE, config);
    const chartEngine = new CIQ.ChartEngine({
      container: document.querySelector('body'),
      ...updatedConfig
    });
    chartEngine.chart.market.normalHours = [
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
      { open_parts: { hours: 4, minutes: 0 } },
    ];
    chartEngine.extendedHours = {
      set: jest.fn()
    };

    const expectedChartParams = {
      span: { base: 'today', multiplier: 1 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    const chartParams = getChartInitParams(FTSE, chartEngine, test1, test2);
    expect(chartParams).toStrictEqual(expectedChartParams);
  });
});
