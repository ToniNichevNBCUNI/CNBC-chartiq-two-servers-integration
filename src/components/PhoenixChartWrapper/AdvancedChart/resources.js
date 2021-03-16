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

import marketFactory from '../marketFactory'; // CNBC market factory

// Event Markers 
import marker from 'chartiq/examples/markers/markersSample.js';
import 'chartiq/examples/markers/tradeAnalyticsSample';
import 'chartiq/examples/markers/videoSample';


//import quoteFeed from "chartiq/examples/feeds/quoteFeedSimulator.js";

// Setting up custom CNBC data connector using time series api
import quoteFeed from './DataConnector';



// Uncomment the following for the forecasting simulator (required for the forecasting sample).
// import forecastQuoteFeed from "chartiq/examples/feeds/quoteFeedForecastSimulator.js";

import PerfectScrollbar from "chartiq/js/thirdparty/perfect-scrollbar.esm.js";

import defaultConfig from 'chartiq/js/defaultConfiguration'; 

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
function getConfig() { 
	return defaultConfig({
		quoteFeed,
		// forecastQuoteFeed, // uncomment to enable forecast quote feed simulator
		markerSample: marker.MarkersSample,
		scrollStyle: PerfectScrollbar,
	});
}

// Creates a complete customised configuration object
function getCustomConfig({ chartId, symbol, onChartReady } = {}) {
	const config = getConfig();

	// Update chart configuration by modifying default configuration
	config.chartId = chartId || "_advanced-chart";


	config.initialSymbol = symbol || {
		symbol: "CMCSA",
		name: "Apple Inc",
		exchDisp: "NASDAQ"
	};

	// default config override for CNBC
	config.builtInThemes = { "ciq-day": "Day"};
	config.themes.defaultTheme = 'ciq-day';

	const feedConfig = {
		CIQ,
		timeSeriesAppendUrl: '/adjusted/EST5EDT.json',
		//noStreamableList,
		//noHistoryDataList,
		quotePageSymbol: 'CMCSA'
	};

	/*
	config.quoteFeed = new QuoteFeed(feedConfig); // setup the quoteFeed using time series API
	config.defaultSymbol = symbolData.symbol;
	config.chartConfig.layout = {
	chartType: 'mountain',
	crosshair: true,
	};
	*/	  

	config.marketFactory = marketFactory;

	// config.quoteFeeds[0].behavior.refreshInterval = 0; // disables quotefeed refresh
	config.onChartReady = onChartReady;

	const {
		marketDepth,
		termStructure,
		tfc,
		timeSpanEventPanel,
		visualEarnings
	} = config.plugins;
	// Select only plugin configurations that needs to be active for this chart
	config.plugins = {
		// marketDepth,
		// termStructure,
		// tfc,
		// timeSpanEventPanel,
		// visualEarnings
	};

	// Enable / disable addOns
	// config.enabledAddOns.tooltip = false;
	// config.enabledAddOns.continuousZoom = true;

	return config;
}

export { CIQ, getConfig, getCustomConfig };
