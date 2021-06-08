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

  const getGranularity = (intervalValue, period, suggestedStartDate) => {
    if (suggestedStartDate.getFullYear() < 1990) {
      return '3MO';
    } else if (intervalValue === 'minute') {
      return `${period}M`;
    } else if (intervalValue === 'day') {
      return `${period}D`;
    }
    return `${period}Y`;
  }

  const supplyChartData = (queryUrl) => {
    const postAjaxParamsObj = {
      url: queryUrl,
      cb: processTimeSeriesResponseCallback,
      noEpoch: true, // tells chartiq to not use a cache burst query string
    };
    CIQ.postAjax(postAjaxParamsObj);
    return postAjaxParamsObj;
  }
  
  
  const formatChartData = (rawChartData, sliceLastImportedData) => {
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
  

  const processTimeSeriesResponseCallback = (status, response, deps) => {
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
        (config.noHistoryDataList.indexOf(config.symbol.toUpperCase()) !== -1 ||
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
  const fetchInitialData = (symbol, suggestedStartDate, suggestedEndDate, params, cb) => {
    if (!window.stxx) {
      return;
    }

    chartBuilderGlobal = cb;
    if (config.noHistoryDataList.indexOf(symbol.toUpperCase()) !== -1) {
      chartTimeRange = '1D';
    } else {
      chartTimeRange = getChartTimeRange();
    }

    const queryUrl = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=${symbol}`;
    shouldRequestBeMadeObj = { addNewDataOnly: false, fromInitialDataRequest: true, moreDataNeeded: !is5YorALL }; // to-do: what is this?!? This value is not even been used
    return supplyChartData(queryUrl);
  }

  // called by chart to fetch pagination data
  const fetchPaginationData = (symbol, suggestedStartDate, suggestedEndDate, params, cb) => {
    // consoleLogHelper('fetchPaginationData', suggestedStartDate, endDate, params)
    if (config.noHistoryDataList.indexOf(symbol.toUpperCase()) === -1) {
      // if (config.noHistoryDataList.indexOf(symbol.toUpperCase()) === -1) {
      startDate = DateHelper.dateToDateStr(suggestedStartDate);
      endDate = DateHelper.dateToDateStr(DateHelper.getEndOfTheDay());
      granularity = getGranularity(params.interval, params.period, suggestedStartDate);
      const queryUrl = `${TIME_SERIES_BAR_API}/${symbol}/${granularity}/${startDate}/${endDate}${config.timeSeriesAppendUrl}?type=scroll`;
      chartBuilderGlobal = cb;
      shouldRequestBeMadeObj = { addNewDataOnly: false, fromInitialDataRequest: false };
      return supplyChartData(queryUrl);
    }
    debugger;
    console.log("!!!!");
  }  

  // called by chart to fetch update data
  const fetchUpdateData = (symbol, suggestedStartDate, params, cb) => {
    // consoleLogHelper('fetchUpdateData', suggestedStartDate, '', params)
    if (config.noStreamableList.indexOf(symbol) === -1) {
      // if symbol is not in the 'noStreamableList', proceed with update
      const queryUrl = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=${symbol}`;
      chartBuilderGlobal = cb;
      shouldRequestBeMadeObj = { addNewDataOnly: true, fromInitialDataRequest: false };
		  return supplyChartData(queryUrl);
    }
    debugger;
    console.log("!!!!");
  }  

  return {
    fetchInitialData,
    fetchPaginationData,
    fetchUpdateData
  }
}

export default DataConnector;
