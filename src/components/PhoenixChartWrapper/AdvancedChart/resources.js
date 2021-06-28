import 'chartiq/js/advanced';
import 'chartiq/js/addOns';
// Symbol mapping to market definition
import 'chartiq/examples/markets/marketDefinitionsSample';
import 'chartiq/examples/markets/marketSymbologySample';
import 'chartiq/examples/feeds/symbolLookupChartIQ';
import 'chartiq/examples/translations/translationSample';
import 'chartiq/js/componentUI';
import 'chartiq/js/components';

import { noHistoryDataList, noStreamableList } from '../chartConstants';
import marketFactory from '../marketFactory';
import PerfectScrollbar from 'chartiq/js/thirdparty/perfect-scrollbar.esm';
import defaultConfig from 'chartiq/js/defaultConfiguration';
import QuoteFeed from '../DataConnector';

function setUpRangesAndPeriodicity(symbolData, config) {
  if (noHistoryDataList.indexOf(symbolData.symbol.toUpperCase()) !== -1) {
    config.rangeMenu = [
      { type: 'range', label: '1D', cmd: 'set(1, \'today\', 1, 1, \'minute\')', cls: 'range-1today'  },
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
      { type: 'range', label: 'All', cmd: 'set(1, \'all\', \'month\', 3)' },
    ];
    config.menuPeriodicity = [
      { type: 'item', label: '1 D', cmd: 'Layout.setPeriodicity(1,1,\'day\')', cls: 'item-hide-1d' },
      { type: 'item', label: '1 W', cmd: 'Layout.setPeriodicity(1,1,\'week\')', cls: 'item-hide-1w' },
      { type: 'item', label: '1 Mo', cmd: 'Layout.setPeriodicity(1,1,\'month\')', cls: 'item-hide-1mo' },
    ];
  } else {
    config.rangeMenu = [
      { type: 'range', label: '1D', cmd: 'set(1, \'today\', 1, 1, \'minute\')', cls: 'range-1today'  },
      { type: 'range', label: '5D', cmd: 'set(5, \'day\', 5, 1, \'minute\')', cls: 'range-5day' },
      { type: 'range', label: '1M', cmd: 'set(1, \'month\')', cls: 'range-1month' },
      { type: 'range', label: '3M', cmd: 'set(3, \'month\')', cls: 'range-3month' },
      { type: 'range', label: '6M', cmd: 'set(6, \'month\')', cls: 'range-6month' },
      { type: 'range', label: 'YTD', cmd: 'set(1, \'ytd\')', cls: 'range-1ytd' },
      { type: 'range', label: '1Y', cmd: 'set(1, \'year\')', cls: 'range-1year' },
      { type: 'range', label: '5Y', cmd: 'set(5, \'year\',1,1,\'week\')', cls: 'range-5year' },
      { type: 'range', label: 'All', cmd: 'set(1, \'all\', \'month\', 3)', cls: 'range-1all' },
      // { type: 'range', label: 'All', cmd: 'set(1, \'all\')', cls: 'range-1all' },
    ];
    config.menuPeriodicity = [
      { type: 'item', label: '1 D', cmd: 'Layout.setPeriodicity(1,1,\'day\')', cls: 'item-hide-1d' },
      { type: 'item', label: '1 W', cmd: 'Layout.setPeriodicity(1,1,\'week\')', cls: 'item-hide-1w' },
      { type: 'item', label: '1 Mo', cmd: 'Layout.setPeriodicity(1,1,\'month\')', cls: 'item-hide-1mo' },
      { type: 'item', label: '3 Mo', cmd: 'Layout.setPeriodicity(3,1,\'month\')', cls: 'item-hide-3mo' },
      { type: 'item', label: '1 Min', cmd: 'Layout.setPeriodicity(1,1,\'minute\')', cls: 'item-hide-1m' },
      { type: 'item', label: '5 Min', cmd: 'Layout.setPeriodicity(5,1,\'minute\')', cls: 'item-hide-5m' },
      { type: 'item', label: '10 Min', cmd: 'Layout.setPeriodicity(10,1,\'minute\')', cls: 'item-hide-10m' },
      { type: 'item', label: '15 Min', cmd: 'Layout.setPeriodicity(15,1,\'minute\')', cls: 'item-hide-15m' },
      { type: 'item', label: '30 Min', cmd: 'Layout.setPeriodicity(30,1,\'minute\')', cls: 'item-hide-30m' },
      { type: 'item', label: '1 Hour', cmd: 'Layout.setPeriodicity(60,1,\'minute\')', cls: 'item-hide-1h' },
    ];
  }
};

// Creates a complete customised configuration object
function getConfig(CIQ, feedConfig) {
  const quoteFeed = new QuoteFeed(CIQ, feedConfig);
  return defaultConfig({
    quoteFeed,
    scrollStyle: PerfectScrollbar,
  });
}

// Creates a complete customised configuration object
function getCustomConfig(CIQ, { onChartReady, quoteData } = {}) {
  //CIQ.localStorage.removeItem('myChartLayout');
  const feedConfig = {
    CIQ,
    timeSeriesAppendUrl: '/adjusted/EST5EDT.json',
    noStreamableList,
    noHistoryDataList,
    symbol: quoteData.symbol,
    quoteData: quoteData
  };
  const config = getConfig(CIQ, feedConfig);
  // Update chart configuration by modifying default configuration
  config.defaultSymbol = quoteData.symbol;
  // CIQ.localStorage.removeItem('myChartLayout');
  config.initialSymbol = {
    symbol: quoteData.symbol,
    name: quoteData.name,
    eschDisp: quoteData.exchange
  }

  config.quoteFeeds[0].behavior.refreshInterval = 10; // seconds
  config.onChartReady = onChartReady;

  // Enable / disable addOns
  // config.enabledAddOns.tooltip = false;
  // config.enabledAddOns.continuousZoom = true;
  setUpRangesAndPeriodicity(quoteData, config);
  // removes arrowup & arrowdown keyboard controls for chart
  config.hotkeyConfig.hotkeys[1].commands = [];
  config.hotkeyConfig.hotkeys[0].commands = [];
  config.footerShare = false;
  config.marketFactory = marketFactory;  
  config.themes.defaultTheme = 'ciq-day';
  console.log(config);
  return config;
}

export { getConfig, getCustomConfig };
