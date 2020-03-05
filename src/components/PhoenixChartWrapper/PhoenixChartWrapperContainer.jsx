import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CIQ } from 'chartiq/js/chartiq';
import 'chartiq/examples/markets/marketDefinitionsSample';

import QuoteFeed from './DataConnector';
import marketFactory from './marketFactory';
import { AdvancedChart } from './chartComponent';
// sets up additonal exchanges not provided by chartiq by default
import exchanges from './exchanges'
// chart style sheets
import './chartiq/styles/base-imports';

// custom css styles following base style sheets
import './customChartiqConfig/chart_styles.css';

// import custom configuration selector function
import { getConfiguration, pluginsToLoadLazy } from './customChartiqConfig';

// import LookupDriver from './lookupDriver';


// remove following line for production use
CIQ.debug = true;

const config = getConfiguration();
const noHistoryDataList = ['.ftse', '.ftmib', '.ftsti', '.klse']
const quoteData = window.__API_DATA__.ITVQuoteResult.ITVQuote;
const initialSymbolData = quoteData
/**
 * Optional callback function to access chart engine and uiContext
 */
const setUpRangesAndPeriodicity = (symbolData) => {
  if (noHistoryDataList.indexOf(symbolData.symbol.toLowerCase()) !== -1) {
    config.footerRange = [
      { label: '1D', multiplier: 1, base: 'today', interval: 1, timeUnit: 'minute', available: 'always' }
    ]
    config.menuPeriodicity = [{ label: '1 Min', periodicity: 1, interval: 1, timeUnit: 'minute' }]
  } else if (symbolData.assetSubType === 'Exchange Traded Fund') {
    config.footerRange = [
      { label: '1M', multiplier: 1, base: 'month', interval: 1, period: 1, timeUnit: 'day', available: 'always' },
      { label: '3M', multiplier: 3, base: 'month', interval: 1,  timeUnit: 'day' },
      { label: '6M', multiplier: 6, base: 'month', interval: 1,  timeUnit: 'day' },
      { label: 'YTD', multiplier: 1, base: 'YTD', interval: 1,  timeUnit: 'day' },
      { label: '1Y', multiplier: 1, base: 'year', interval: 1,  timeUnit: 'day', available: 'always' },
      { label: '5Y', multiplier: 5, base: 'year', interval: 1, period: 1, timeUnit: 'day' },
      { label: 'All', multiplier: 1, base: 'all', interval: 1,  timeUnit: 'day' }
    ]
    config.menuPeriodicity = [
      { label: '1 D', periodicity: 1, interval: 1, timeUnit: 'day' },
      { label: '1 W', periodicity: 1, interval: 1, timeUnit: 'week' },
      { label: '1 Mo', periodicity: 1, interval: 1, timeUnit: 'month' },
    ]
  } else if (symbolData.type === 'STOCK' && symbolData.countryCode === 'US') {
    config.menuPeriodicity = [
      { label: '1 Min', periodicity: 1, interval: 1, timeUnit: 'minute' },
      { label: '5 Min', periodicity: 1, interval: 5, timeUnit: 'minute' },
      { label: '10 Min', periodicity: 1, interval: 10, timeUnit: 'minute' },
      { label: '15 Min', periodicity: 3, interval: 5, timeUnit: 'minute' },
      { label: '30 Min', periodicity: 1, interval: 30, timeUnit: 'minute' },
      { label: '1 Hour', periodicity: 2, interval: 30, timeUnit: 'minute' },
    ]
  }
}

const setUpChartConfig = (symbolData) => {
  CIQ.localStorage.removeItem('myChartLayout')
  const feedConfig = {
    CIQ,
    quote_api_url: 'https://quote.cnbc.com/quote-html-webservice/quote.htm?exthrs=1&output=json&partnerId=2&1473869228859&symbols=',
    time_series_api_url: 'https://ts-api.cnbc.com/harmony/app/bars/',
    time_series_append_url: '/adjusted/EST5EDT.json',
    no_streamable_list: ['.DJIA'],
    noHistoryDataList,
  }

  config.quoteFeed = new QuoteFeed(feedConfig); // setup the quoteFeed using time series API
  config.defaultSymbol = symbolData.symbol
  config.chartConfig.layout = {
    chartType: 'mountain',
    crosshair: true,
  }

  config.footerShare = false
  config.marketFactory = marketFactory
  config.symbolData = symbolData
  setUpRangesAndPeriodicity(symbolData)
}

const getChartInitParams = (symbolData) => {
  const period = 1
  let base = 'today'
  let multiplier = 1 
  let interval = 1

  if (noHistoryDataList.indexOf(symbolData.symbol.toLowerCase()) !== - 1) {
    base = 'day'
    interval = 'minute'
    multiplier = 1
  }

  return {
    span: { base, multiplier },
    periodicity: { period, interval }
  }
}

const setUpChartRefreshWithQuoteData = (chartEngine) => {
}


const chartInitialized = ({
  chartEngine,
  uiContext
}) => {
  const UIStorage = new CIQ.NameValueStore();
  const UIThemes = $('cq-themes');
  UIThemes[0].initialize({
    builtInThemes: { 'ciq-day': 'Day', 'ciq-night': 'Night' },
    defaultTheme: 'ciq-day',
    nameValueStore: UIStorage
  });

  chartEngine.chart.symbolObject = initialSymbolData
  chartEngine.marketData = null
  chartEngine.loadChart(initialSymbolData.symbol, getChartInitParams(initialSymbolData))

  setUpChartRefreshWithQuoteData(chartEngine)
  // uiContext.setLookupDriver(new LookupDriver(chartEngine))
  // access to chart engine and uiContext
  
  new CIQ.Tooltip({ stx: chartEngine, ohl: true, volume: true, series: true, studies: true });
  
  // Inactivity timer
  new CIQ.InactivityTimer({
    stx: chartEngine,
    minutes: 30
  });

  // Volume Underlay
  CIQ.Studies.addStudy(chartEngine, 'vol undr', {}, {
    'Down Volume': '#e0352b',
    'Up Volume': '#31a745'
  }, {
    heightPercentage: 0.25,
    widthFactor: .05
  })
};

const CustomChart = () => {
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized) {
      setUpChartConfig(quoteData)
      setHasInitialized(true)
    }
  }, [hasInitialized])

  return ( 
    <div >
      <AdvancedChart
        config={config}
        chartInitialized={chartInitialized}
        pluginsToLoadLazy={pluginsToLoadLazy}
      />   
    </div>
  )
}

export default CustomChart;
