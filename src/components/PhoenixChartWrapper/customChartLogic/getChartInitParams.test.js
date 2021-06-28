// import { CIQ } from 'chartiq/js/chartiq';
import getChartInitParams from './getChartInitParams';
import commonUSStock from '../__mocks__/commonStock.json';
import CIQ from '../__mocks__/chartIq';
import chartEngine from '../__mocks__/chartEngine';

window.CIQ = CIQ;

describe('getChartInitParams', () => {

  it('Date is undefined', () => {
    const result = getChartInitParams(CIQ, commonUSStock, chartEngine);
    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    expect(result).toStrictEqual(expectedChartParams);
  });

  it('Date is passed and it`s market day', () => {
    const date = new Date();
    chartEngine.isMarketDay = () => true;
    const result = getChartInitParams(CIQ, commonUSStock, chartEngine, date);
    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    expect(result).toStrictEqual(expectedChartParams);
  });

  it('Market day, market open, Monday', () => {
    const curentDate = new Date(2050, 10, 14);
    curentDate.setHours(10);
    const date = new Date(2050, 10, 28);
    date.setHours(10);
    chartEngine.chart.market.isMarketDay = () => true;
    // chartEngine.chart.market.normalHours[5].open_parts.hours =
    chartEngine.chart.market.getOpen = () => date;
    const result = getChartInitParams(CIQ, commonUSStock, chartEngine, false, curentDate);
    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    expect(result).toStrictEqual(expectedChartParams);
  });

  it('Market day, not Monday, extendedHours', () => {
    const curentDate = new Date(2050, 10, 15);
    curentDate.setHours(10);
    const date = new Date(2050, 10, 28);
    date.setHours(10);
    chartEngine.chart.market.isMarketDay = () => true;
    chartEngine.chart.market.getOpen = () => date;
    chartEngine.chart.market.getClose = () => new Date(2050, 10, 13);
    const result = getChartInitParams(CIQ, commonUSStock, chartEngine, false, curentDate);
    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    expect(result).toStrictEqual(expectedChartParams);
  });

  it('Date is passed and it`s market day', () => {
    const date = new Date();
    const result = getChartInitParams(CIQ, commonUSStock, chartEngine, false, date);
    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    expect(result).toStrictEqual(expectedChartParams);
  });

  it('Symbol data subtype', () => {
    const date = new Date();
    chartEngine.isMarketDay = () => true;
    commonUSStock.subType = 'Exchange Traded Fund';
    const result = getChartInitParams(CIQ, commonUSStock, chartEngine, false, date);
    const expectedChartParams = {
      span: { base: 'year', multiplier: 1 },
      periodicity: { period: 1, interval: 1, timeUnit: 'day' }
    };
    expect(result).toStrictEqual(expectedChartParams);
  });

  it('Is market day and extended hours and before market is opening and Monday', () => {
    const date = new Date('2010-10-18T05:24:00');
    chartEngine.chart.market.isMarketDay = () => true;
    commonUSStock.subType = 'US stock';
    chartEngine.chart.market.getOpen = () => new Date('2010-10-18T09:00:00');
    const result = getChartInitParams(CIQ, commonUSStock, chartEngine, date);
    const expectedChartParams = {
      span: { base: 'day', multiplier: 2 },
      periodicity: { period: 1, interval: 1, timeUnit: 'minute' }
    };
    expect(result).toStrictEqual(expectedChartParams);
  });
});
