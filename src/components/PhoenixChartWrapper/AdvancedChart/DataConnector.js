// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
// SAMPLE QUOTEFEED IMPLEMENTATION -- Connects charts to ChartIQ Simulator
///////////////////////////////////////////////////////////////////////////////////////////////////////////

import getChartTimeRange from './getChartTimeRange';
import DateHelper from './DateHelper';
import { CIQ } from 'chartiq/js/chartiq';


var quoteFeedSimulator = {}; // the quotefeed object

const TIME_SERIES_CHART_API = "//ts-api-qa.cnbc.com/harmony/app/charts";
const TIME_SERIES_BAR_API = "//ts-api-qa.cnbc.com/harmony/app/bars";

let chartTimeRange = '1D';
const is5YorALL = chartTimeRange === '5Y' || chartTimeRange === 'ALL';

let config = {
	quotePageSymbol: 'AAPL',
	noHistoryDataList : ''
}

let startDate;
let endDate;
let granularity;

let lastUpdatedTime;
let shouldRequestBeMadeObj = { addNewDataOnly: false, fromInitialDataRequest: true, moreDataNeeded: !is5YorALL };
let chartBuilderGlobal;


// local, non-dependent implementation of XmlHttpRequest
quoteFeedSimulator.postAjax = function (url, cb) {
	var server = new XMLHttpRequest();
	url += (url.indexOf("?") == -1 ? "?" : "&") + new Date().getTime();
	server.open("GET", url);
	server.onload = function () {
		cb(this.status, this.responseText);
	};
	server.onerror = function () {
		cb(500);
	};
	server.send();
};
quoteFeedSimulator.maxTicks = 20000;
quoteFeedSimulator.url = "https://simulator.chartiq.com/datafeed";


function supplyChartData(queryUrl) {
	queryUrl = queryUrl.split('APPL').join('AAPL');
    const postAjaxParamsObj = {
      url: queryUrl,
      cb: processTimeSeriesResponseCallback,
      noEpoch: true, // tells chartiq to not use a cache burst query string
    };
    CIQ.postAjax(postAjaxParamsObj);
    return postAjaxParamsObj;
  }



  // called by chart to fetch initial data
  quoteFeedSimulator.fetchInitialData= function(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    if (!window.stxx) {
      //return;
    }

	let chartTimeRange;
	chartBuilderGlobal = cb;
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
        formatedChartData = quoteFeedSimulator.formatChartData(rawChartData, true);
      } else {
        formatedChartData = quoteFeedSimulator.formatChartData(rawChartData, false);
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
  
  


  





// called by chart to fetch initial data
quoteFeedSimulator.fetchInitialData_old = function (
	symbol,
	suggestedStartDate,
	suggestedEndDate,
	params,
	cb
) {
	var queryUrl =
		quoteFeedSimulator.url +
		"?session=" +
		params.quoteDriverID + // add on unique sessionID required by ChartIQ simulator;
		"&identifier=" +
		symbol +
		"&startdate=" +
		suggestedStartDate.toISOString() +
		"&enddate=" +
		suggestedEndDate.toISOString() +
		"&interval=" +
		params.interval +
		"&period=" +
		params.period +
		"&extended=" +
		(params.extended ? 1 : 0); // using filter:true for after hours
	quoteFeedSimulator.postAjax(queryUrl, function (status, response) {
		// process the HTTP response from the datafeed
		if (status == 200) {
			// if successful response from datafeed
			var newQuotes = quoteFeedSimulator.formatChartData(response, symbol);
			cb({
				quotes: newQuotes,
				moreAvailable: true,
				attribution: { source: "simulator", exchange: "RANDOM" }
			}); // return the fetched data; init moreAvailable to enable pagination
		} else {
			// else error response from datafeed
			cb({ error: response ? response : status }); // specify error in callback
		}
	});
};


// called by chart to fetch update data
quoteFeedSimulator.fetchUpdateData = function (symbol, startDate, params, cb) {
	var queryUrl =
		quoteFeedSimulator.url +
		"?session=" +
		params.quoteDriverID + // add on unique sessionID required by ChartIQ simulator;
		"&identifier=" +
		symbol +
		"&startdate=" +
		startDate.toISOString() +
		"&interval=" +
		params.interval +
		"&period=" +
		params.period +
		"&extended=" +
		(params.extended ? 1 : 0); // using filter:true for after hours
	quoteFeedSimulator.postAjax(queryUrl, function (status, response) {
		// process the HTTP response from the datafeed
		if (status == 200) {
			// if successful response from datafeed
			var newQuotes = quoteFeedSimulator.formatChartData(response, symbol);
			cb({
				quotes: newQuotes,
				attribution: { source: "simulator", exchange: "RANDOM" }
			}); // return the fetched data
		} else {
			// else error response from datafeed
			cb({ error: response ? response : status }); // specify error in callback
		}
	});
};
// called by chart to fetch pagination data
quoteFeedSimulator.fetchPaginationData = function (
	symbol,
	suggestedStartDate,
	endDate,
	params,
	cb
) {
	var queryUrl =
		quoteFeedSimulator.url +
		"?session=" +
		params.quoteDriverID + // add on unique sessionID required by ChartIQ simulator;
		"&identifier=" +
		symbol +
		"&startdate=" +
		suggestedStartDate.toISOString() +
		"&enddate=" +
		endDate.toISOString() +
		"&interval=" +
		params.interval +
		"&period=" +
		params.period +
		"&extended=" +
		(params.extended ? 1 : 0); // using filter:true for after hours
	quoteFeedSimulator.postAjax(queryUrl, function (status, response) {
		// process the HTTP response from the datafeed
		if (status == 200) {
			// if successful response from datafeed
			var newQuotes = quoteFeedSimulator.formatChartData(response, symbol);
			cb({
				quotes: newQuotes,
				moreAvailable: suggestedStartDate.getTime() > 0,
				upToDate: endDate.getTime() > Date.now(),
				attribution: { source: "simulator", exchange: "RANDOM" }
			}); // return fetched data (and set moreAvailable)
		} else {
			// else error response from datafeed
			cb({ error: response ? response : status }); // specify error in callback
		}
	});
};


quoteFeedSimulator.formatChartData = function(rawChartData, sliceLastImportedData) {
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


export default quoteFeedSimulator;
