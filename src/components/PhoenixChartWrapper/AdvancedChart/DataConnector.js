import getChartTimeRange from './getChartTimeRange';
import DateHelper from './DateHelper';
import { CIQ } from 'chartiq/js/chartiq';

const TIME_SERIES_CHART_API = "//ts-api-qa.cnbc.com/harmony/app/charts";
const TIME_SERIES_BAR_API = "//ts-api-qa.cnbc.com/harmony/app/bars";

let chartTimeRange = '1D';
const is5YorALL = chartTimeRange === '5Y' || chartTimeRange === 'ALL';

let startDate;
let endDate;
let granularity;

let lastUpdatedTime;
let shouldRequestBeMadeObj = { addNewDataOnly: false, fromInitialDataRequest: true, moreDataNeeded: !is5YorALL };
let chartBuilderGlobal;




const DataConnector = (config) => {

  function supplyChartData(queryUrl) {
    const postAjaxParamsObj = {
      url: queryUrl,
      cb: processTimeSeriesResponseCallback,
      noEpoch: true, // tells chartiq to not use a cache burst query string
    };
    CIQ.postAjax(postAjaxParamsObj);
    return postAjaxParamsObj;
  }
  
  
  
  function formatChartData (rawChartData, sliceLastImportedData) {
    if (rawChartData.barData === null) { return []; }
  
    const chartData = rawChartData.barData.priceBars;
    if (chartData.length === 0) { return []; }
  
    const formatedChartData = [];
  
    // fix for loop
    for (let dd = chartData.length-1; dd >= 0; dd-=1) {
      const UTCDate = DateHelper.dateStringToDateObject(chartData[dd].tradeTime);
      if (sliceLastImportedData === true && UTCDate <= lastUpdatedTime) {
        break;
      }
      formatedChartData.unshift({
        DT: UTCDate,
        Close: parseFloat(chartData[dd].close),
        Open: parseFloat(chartData[dd].open),
        High: parseFloat(chartData[dd].high),
        Low: parseFloat(chartData[dd].low),
        Volume: chartData[dd].volume === null ? undefined : parseInt(chartData[dd].volume, 10),
      });
    }
    const lastDataPoint = chartData.length - 1;
    lastUpdatedTime = DateHelper.dateStringToDateObject(chartData[lastDataPoint].tradeTime);
    return formatedChartData;
  }
  

  function processTimeSeriesResponseCallback(status, response, deps) {
    if (deps) {
      if (deps.cb) {
        chartBuilderGlobal = deps.cb;
      }
      if (deps.shouldRequestBeMadeObj) {
        shouldRequestBeMadeObj = deps.shouldRequestBeMadeObj;
      }
    }
  
    // process the HTTP response from the datafeed
    if (status === 200) { // if successful response from datafeed
      const rawChartData=JSON.parse(response);
      let formatedChartData;
      if (shouldRequestBeMadeObj.addNewDataOnly) {
        formatedChartData = formatChartData(rawChartData, true);
      } else {
        formatedChartData = formatChartData(rawChartData, false);
      }
  
      if (
        shouldRequestBeMadeObj.addNewDataOnly === false &&
        (config.noHistoryDataList.indexOf(config.quotePageSymbol.toUpperCase()) !== -1 ||
        !shouldRequestBeMadeObj.fromInitialDataRequest)
      ) {
        chartBuilderGlobal({ quotes: formatedChartData, moreAvailable: false });
        return;
      }
      chartBuilderGlobal({
        quotes: formatedChartData,
        attribution: { source: 'CNBC' },
        moreAvailable: shouldRequestBeMadeObj.moreDataNeeded || false,
      });
    } else {
      // else error response from datafeed & specify error in callback
      chartBuilderGlobal({ error: status });
    }
  };  

  // Public methods

  // called by chart to fetch initial data
  function fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    if (!window.stxx) {
      //return;
    }

    let chartTimeRange;
    chartBuilderGlobal = cb;
    debugger;
    if (config.noHistoryDataList.indexOf(symbol.toUpperCase()) !== -1) {
      chartTimeRange = '1D';
    } else {
      chartTimeRange = getChartTimeRange();
    }

    const is5YorALL = chartTimeRange === '5Y' || chartTimeRange === 'ALL';
    const queryUrl = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=${symbol}`;

    let shouldRequestBeMadeObj = { addNewDataOnly: false, fromInitialDataRequest: true, moreDataNeeded: !is5YorALL };
    return supplyChartData(queryUrl);
  }
  return {
    fetchInitialData
  }
}

export default DataConnector;
