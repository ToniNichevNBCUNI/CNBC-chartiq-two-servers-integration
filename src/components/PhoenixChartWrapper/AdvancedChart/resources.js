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
function getCustomConfig({ chartId, symbol, onChartReady, initialCNBCconfig } = {}) {
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
  console.log('>>>>', config);
  /*
	// CNBC customization, that won't work with the new config
	config.menuPeriodicity = [
		{ label: '1 D', periodicity: 1, interval: 1, timeUnit: 'day' },
		{ label: '1 W', periodicity: 1, interval: 1, timeUnit: 'week' },
		{ label: '1 Mo', periodicity: 1, interval: 1, timeUnit: 'month' },
		{ label: '1 Min', periodicity: 1, interval: 1, timeUnit: 'minute' },
		{ label: '5 Min', periodicity: 1, interval: 5, timeUnit: 'minute' },
		{ label: '10 Min', periodicity: 1, interval: 10, timeUnit: 'minute' },
		{ label: '15 Min', periodicity: 3, interval: 5, timeUnit: 'minute' },
		{ label: '30 Min', periodicity: 1, interval: 30, timeUnit: 'minute' },
		{ label: '1 Hour', periodicity: 2, interval: 30, timeUnit: 'minute' },
		{ label: '4 Hour', periodicity: 8, interval: 30, timeUnit: 'minute' },
	  ];
	  */

  config.menuPeriodicity = [
    { type: 'item', label: '1 D', cmd: 'Layout.setPeriodicity(1,1,\'day\')' },
    { type: 'item', label: '1 W', cmd: 'Layout.setPeriodicity(1,1,\'week\')' },
    { type: 'item', label: '1 Mo', cmd: 'Layout.setPeriodicity(1,1,\'month\')' },
    { type: 'separator', },
    { type: 'item', label: '1 Min', cmd: 'Layout.setPeriodicity(1,1,\'minute\')' },
    { type: 'item', label: '5 Min', cmd: 'Layout.setPeriodicity(1,5,\'minute\')' },
    { type: 'item', label: '10 Min', cmd: 'Layout.setPeriodicity(1,10,\'minute\')' },
    { type: 'item', label: '15 Min', cmd: 'Layout.setPeriodicity(3,5,\'minute\')' },
    { type: 'item', label: '30 Min', cmd: 'Layout.setPeriodicity(1,30,\'minute\')' },
    { type: 'item', label: '1 Hour', cmd: 'Layout.setPeriodicity(2,30,\'minute\')' },
    { type: 'item', label: '4 Hour', cmd: 'Layout.setPeriodicity(8,30,\'minute\')' },
    { type: 'separator', },
    { type: 'item', label: '1 Sec', cmd: 'Layout.setPeriodicity(1,1,\'second\')' },
    { type: 'item', label: '10 Sec', cmd: 'Layout.setPeriodicity(1,10,\'second\')' },
    { type: 'item', label: '30 Sec', cmd: 'Layout.setPeriodicity(1,30,\'second\')' },
    { type: 'separator', },
    { type: 'item', label: '250 MSec', cmd: 'Layout.setPeriodicity(1,250,\'millisecond\')' }
  ];

  config.quoteFeeds[0].behavior.refreshInterval = 10; // seconds
  config.onChartReady = onChartReady;

  // Enable / disable addOns
  // config.enabledAddOns.tooltip = false;
  // config.enabledAddOns.continuousZoom = true;

  return config;
}

export { CIQ, getConfig, getCustomConfig };
