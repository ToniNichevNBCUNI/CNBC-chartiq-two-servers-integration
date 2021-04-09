/* eslint-disable no-param-reassign */
import { CIQ } from 'chartiq/js/chartiq';

import QuoteFeed from '../DataConnector';
import marketFactory from '../marketFactory';
import { noHistoryDataList, noStreamableList } from '../chartConstants';

const setUpRangesAndPeriodicity = (symbolData, config) => {
  if (noHistoryDataList.indexOf(symbolData.symbol.toUpperCase()) !== -1) {
    config.rangeMenu = [
      { label: '1D', multiplier: 1, base: 'today', interval: 1, timeUnit: 'minute', available: 'always' }
    ];
    config.menuPeriodicity = [];
  } else if (symbolData.subType === 'Mutual Fund') {
    config.rangeMenu = [
      { type: 'range', label: '1M', cmd: 'set(1, \'month\')' },
      { type: 'range', label: '3M', cmd: 'set(3, \'month\')' },
      { type: 'range', label: '6M', cmd: 'set(6, \'month\')' },
      { type: 'range', label: 'YTD', cmd: 'set(1, \'YTD\')' },
      { type: 'range', label: '1Y', cmd: 'set(1, \'year\')' },
      { type: 'range', label: '5Y', cmd: 'set(5, \'year\')' },
      { type: 'range', label: 'All', cmd: 'set(1, \'all\')' },
    ];
    config.menuPeriodicity = [
      { type: 'item', label: '1 D', cmd: 'Layout.setPeriodicity(1,1,\'day\')', cls: 'item-hide-1d' },
      { type: 'item', label: '1 W', cmd: 'Layout.setPeriodicity(1,1,\'week\')', cls: 'item-hide-1w' },
      { type: 'item', label: '1 Mo', cmd: 'Layout.setPeriodicity(1,1,\'month\')', cls: 'item-hide-1mo' },
    ];
  } else {
    config.rangeMenu = [
      { type: 'range', label: '1D', cmd: 'set(1, \'today\', 1, 1, \'minute\')' },
      { type: 'range', label: '5M', cmd: 'set(5, \'day\', 5, 1, \'minute\')' },
      { type: 'range', label: '1M', cmd: 'set(1, \'month\')' },
      { type: 'range', label: '3M', cmd: 'set(3, \'month\')' },
      { type: 'range', label: '6M', cmd: 'set(6, \'month\')' },
      { type: 'range', label: 'YTD', cmd: 'set(1, \'ytd\')' },
      { type: 'range', label: '1Y', cmd: 'set(1, \'year\')' },
      { type: 'range', label: '5Y', cmd: 'set(5, \'year\',1,1,\'week\')' },
      { type: 'range', label: 'All', cmd: 'set(1, \'all\')' },
    ];
    config.menuPeriodicity = [
      { type: 'item', label: '1 D', cmd: 'Layout.setPeriodicity(1,1,\'day\')', cls: 'item-hide-1d' },
      { type: 'item', label: '1 W', cmd: 'Layout.setPeriodicity(1,1,\'week\')', cls: 'item-hide-1w' },
      { type: 'item', label: '1 Mo', cmd: 'Layout.setPeriodicity(1,1,\'month\')', cls: 'item-hide-1mo' },
      { type: 'item', label: '1 Min', cmd: 'Layout.setPeriodicity(1,1,\'minute\')', cls: 'item-hide-1m' },
      { type: 'item', label: '5 Min', cmd: 'Layout.setPeriodicity(5,1,\'minute\')', cls: 'item-hide-5m' },
      { type: 'item', label: '10 Min', cmd: 'Layout.setPeriodicity(10,1,\'minute\')', cls: 'item-hide-10m' },
      { type: 'item', label: '15 Min', cmd: 'Layout.setPeriodicity(15,1,\'minute\')', cls: 'item-hide-15m' },
      { type: 'item', label: '30 Min', cmd: 'Layout.setPeriodicity(30,1,\'minute\')', cls: 'item-hide-30m' },
      { type: 'item', label: '1 Hour', cmd: 'Layout.setPeriodicity(60,1,\'minute\')', cls: 'item-hide-1h' },
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
  /*
  config.chartConfig.layout = {
    chartType: 'mountain',
    crosshair: true,
  };
  */

  config.footerShare = false;
  config.marketFactory = marketFactory;
  config.symbolData = symbolData;
  setUpRangesAndPeriodicity(symbolData, config);
  return config;
};

export default setUpChartConfig;
