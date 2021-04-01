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
    config.menuPeriodicity = null;
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
      { label: '1 D', periodicity: 1, interval: 1, timeUnit: 'day', className: 'item-hide-1d' },
      { label: '1 W', periodicity: 1, interval: 1, timeUnit: 'week', className: 'item-hide-1w' },
      { label: '1 Mo', periodicity: 1, interval: 1, timeUnit: 'month', className: 'item-hide-1mo' },
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
      { type: "item", label: "1 D", cmd: "Layout.setPeriodicity(1,1,'day')" },
      { type: "item", label: "1 W", cmd: "Layout.setPeriodicity(1,1,'week')" },
      { type: "item", label: "1 Mo", cmd: "Layout.setPeriodicity(1,1,'month')" },
      { type: "separator", },
      { type: "item", label: "1 Min", cmd: "Layout.setPeriodicity(1,1,'minute')" },
      { type: "item", label: "5 Min", cmd: "Layout.setPeriodicity(1,5,'minute')" },
      { type: "item", label: "10 Min", cmd: "Layout.setPeriodicity(1,10,'minute')" },
      { type: "item", label: "15 Min", cmd: "Layout.setPeriodicity(3,5,'minute')" },
      { type: "item", label: "30 Min", cmd: "Layout.setPeriodicity(1,30,'minute')" },
      { type: "item", label: "1 Hour", cmd: "Layout.setPeriodicity(2,30,'minute')" },
    ];
    /*    
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
    */
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
