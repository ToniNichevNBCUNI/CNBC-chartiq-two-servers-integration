// Required imports from chartiq for advanced chart

import { CIQ } from 'chartiq/js/chartiq';
import 'chartiq/js/advanced';
import 'chartiq/js/addOns';

// Symbol mapping to market definition
import 'chartiq/examples/markets/marketDefinitionsSample';
import 'chartiq/examples/markets/marketSymbologySample';

import 'chartiq/examples/feeds/symbolLookupChartIQ';

import 'chartiq/examples/translations/translationSample';

import 'chartiq/js/componentUI';
import 'chartiq/js/components';

// Event Markers
import marker from 'chartiq/examples/markers/markersSample';
import 'chartiq/examples/markers/tradeAnalyticsSample';
import 'chartiq/examples/markers/videoSample';

import { noHistoryDataList, noStreamableList } from '../chartConstants';

// Uncomment the following for the forecasting simulator (required for the forecasting sample).
// import forecastQuoteFeed from "chartiq/examples/feeds/quoteFeedForecastSimulator.js";

import PerfectScrollbar from 'chartiq/js/thirdparty/perfect-scrollbar.esm';

import defaultConfig from 'chartiq/js/defaultConfiguration';

// import quoteFeed from "chartiq/examples/feeds/quoteFeedSimulator.js";
import QuoteFeed from '../DataConnector';

// Plugins

// Crypto, L2 Heat Map, Market Depth,
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
// import 'chartiq/plugins/activetrader/cryptoiq';

// ScriptIQ
// import 'chartiq/plugins/scriptiq/scriptiq';

// Trading Central: Technical Insights
// import 'chartiq/plugins/technicalinsights/components'

// TFC plugin
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
// import 'chartiq/plugins/tfc/tfc-loader';
// import 'chartiq/plugins/tfc/tfc-demo';   /* if using demo account class */

// Time Span Events
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
// import 'chartiq/plugins/timespanevent/timespanevent';
// import 'chartiq/plugins/timespanevent/examples/timeSpanEventSample';  /* if using sample */

// Trading Central: Analyst Views
// import 'chartiq/plugins/analystviews/components';

// Visual Earnings
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
// import 'chartiq/plugins/visualearnings/visualearnings';

// Uncomment the following for the L2 simulator (required for the crypto sample and MarketDepth addOn)
// import 'chartiq/examples/feeds/L2_simulator'; /* for use with cryptoiq */

function setUpRangesAndPeriodicity(symbolData, config) {
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
      { type: 'range', label: '5D', cmd: 'set(5, \'day\', 5, 1, \'minute\')' },
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


// Creates a complete customised configuration object
function getConfig(initialCNBCconfig) {
  const quoteFeed = new QuoteFeed(initialCNBCconfig);
  return defaultConfig({
    quoteFeed,
    // forecastQuoteFeed, // uncomment to enable forecast quote feed simulator
    markerSample: marker.MarkersSample,
    scrollStyle: PerfectScrollbar,
  });
}

// Creates a complete customised configuration object
function getCustomConfig({ chartId, symbol, onChartReady, initialCNBCconfig, quoteData } = {}) {
  const config = getConfig(initialCNBCconfig);

  // Update chart configuration by modifying default configuration
  config.chartId = chartId || '_advanced-chart';
  config.initialSymbol = symbol || {
    symbol: 'AAPL',
    name: 'Apple Inc',
    exchDisp: 'NASDAQ'
  };
  config.addOns.tooltip = null;
  // to-do: neither one of these affects the chart
  // select and order symbol market tabs
  // config.symbolLookupTabs = ['ALL', 'FX', 'STOCKS'];
  // config.footer = null;
  // config.menus = ['menuPeriodicity', 'menuDisplay', 'menuStudies'];
 
  config.quoteFeeds[0].behavior.refreshInterval = 10; // seconds
  config.onChartReady = onChartReady;

  // Enable / disable addOns
  // config.enabledAddOns.tooltip = false;
  // config.enabledAddOns.continuousZoom = true;

  setUpRangesAndPeriodicity(quoteData, config);

  return config;
}

export { CIQ, getConfig, getCustomConfig };
