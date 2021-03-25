/* eslint-disable no-param-reassign */
import { CIQ } from 'chartiq/js/chartiq';

import QuoteFeed from '../DataConnector';
import marketFactory from '../marketFactory';
import { noHistoryDataList, noStreamableList } from '../chartConstants';

const setUpRangesAndPeriodicity = (symbolData, config) => {
  if (noHistoryDataList.indexOf(symbolData.symbol.toUpperCase()) !== -1) {
    config.footerRange = [
      { label: '1D', multiplier: 1, base: 'today', interval: 1, timeUnit: 'minute', available: 'always' }
    ];
    config.menuPeriodicity = null;
  } else if (symbolData.subType === 'Mutual Fund') {
    config.footerRange = [
      { label: '1M', multiplier: 1, base: 'month' },
      { label: '3M', multiplier: 3, base: 'month' },
      { label: '6M', multiplier: 6, base: 'month' },
      { label: 'YTD', multiplier: 1, base: 'YTD' },
      { label: '1Y', multiplier: 1, base: 'year' },
      { label: '5Y', multiplier: 5, base: 'year', interval: 'week', period: 1, timeUnit: 'week' },
      { label: 'All', multiplier: 1, base: 'all', interval: 'month', period: 3 }
    ];
    config.menuPeriodicity = [
      { label: '1 D', periodicity: 1, interval: 1, timeUnit: 'day', className: 'item-hide-1d' },
      { label: '1 W', periodicity: 1, interval: 1, timeUnit: 'week', className: 'item-hide-1w' },
      { label: '1 Mo', periodicity: 1, interval: 1, timeUnit: 'month', className: 'item-hide-1mo' },
    ];
  } else {
    config.footerRange = [
      { label: '1D', multiplier: 1, base: 'today', interval: 1, period: 1, timeUnit: 'minute', available: 'always' },
      { label: '5D', multiplier: 5, base: 'day', interval: 1, period: 5, timeUnit: 'minute', available: 'always' },
      { label: '1M', multiplier: 1, base: 'month' },
      { label: '3M', multiplier: 3, base: 'month' },
      { label: '6M', multiplier: 6, base: 'month' },
      { label: 'YTD', multiplier: 1, base: 'YTD' },
      { label: '1Y', multiplier: 1, base: 'year' },
      { label: '5Y', multiplier: 5, base: 'year', interval: 'week', period: 1, timeUnit: 'week' },
      { label: 'All', multiplier: 1, base: 'all', interval: 'month', period: 3 }
    ];
    config.menuPeriodicity = [
      { label: '1 D', periodicity: 1, interval: 1, timeUnit: 'day', className: 'item-hide-1d' },
      { label: '1 W', periodicity: 1, interval: 1, timeUnit: 'week', className: 'item-hide-1w' },
      { label: '1 Mo', periodicity: 1, interval: 1, timeUnit: 'month', className: 'item-hide-1mo' },
      { label: '1 Min', periodicity: 1, interval: 1, timeUnit: 'minute', className: 'item-hide-1m' },
      { label: '5 Min', periodicity: 5, interval: 1, timeUnit: 'minute', className: 'item-hide-5m' },
      { label: '10 Min', periodicity: 10, interval: 1, timeUnit: 'minute', className: 'item-hide-10m' },
      { label: '15 Min', periodicity: 15, interval: 1, timeUnit: 'minute', className: 'item-hide-15m' },
      { label: '30 Min', periodicity: 30, interval: 1, timeUnit: 'minute', className: 'item-hide-30m' },
      { label: '1 Hour', periodicity: 60, interval: 1, timeUnit: 'minute', className: 'item-hide-1h' },
    ];
  }
};

const setUpChartConfig = (symbolData, config) => {
  CIQ.localStorage.removeItem('myChartLayout');
  const feedConfig = {
    CIQ,
    timeSeriesAppendUrl: '/adjusted/EST5EDT.json',
    noStreamableList,
    noHistoryDataList,
    quotePageSymbol: symbolData.symbol
  };

  config.quoteFeed = new QuoteFeed(feedConfig); // setup the quoteFeed using time series API
  config.defaultSymbol = symbolData.symbol;
  config.chartConfig.layout = {
    chartType: 'mountain',
    crosshair: true,
  };

  config.footerShare = false;
  config.marketFactory = marketFactory;
  config.symbolData = symbolData;
  setUpRangesAndPeriodicity(symbolData, config);
  return config;
};

export default setUpChartConfig;
