const DateHelper = require('./DateHelper');

const symbolInfo = {"symbol": 'AAPL'};

const DataConnector = function(config) {
  var ts_dataURL = config.time_series_api_url //'http://ts-api.cnbc.com/harmony/app/bars/'
  var ts_appendURL = config.time_series_append_url //'/adjusted/EST5EDT.json'
	var quote_api_url = config.quote_api_url
  var _startDate, _endDate, _granularity
  var dateHelper = new DateHelper()
  var no_streamable_list = config.no_streamable_list
	var _lastUpdateTime = null
  var CIQ = config.CIQ

  // called by chart to fetch initial data
  function fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    consoleLogHelper('fetchInitialData', suggestedStartDate, suggestedEndDate, params)

		if(config.no_history_data_list.indexOf(symbolInfo.symbol)) {
			var today = dateHelper.getBeginningOfTheDay()
			_startDate = dateHelper.dateToDateStr(today)
		}
		else
    	_startDate = dateHelper.dateToDateStr( suggestedStartDate)
    _endDate = dateHelper.dateToDateStr(suggestedEndDate)
    _granularity = _getGranularity(params.period, params.interval, params.period)
    var queryUrl = ts_dataURL + symbol + '/' + _granularity + '/' + _startDate +  '/' + _endDate + ts_appendURL
    _supplyChartData(symbol, queryUrl, cb, false)
  }

  // called by chart to fetch pagination data
  function fetchPaginationData(symbol, suggestedStartDate, endDate, params, cb) {
    consoleLogHelper('fetchPaginationData', suggestedStartDate, endDate, params)

    _startDate = dateHelper.dateToDateStr(suggestedStartDate)
    _endDate = dateHelper.dateToDateStr(endDate)
    _granularity = _getGranularity(params.period, params.interval, params.period)
    var queryUrl = ts_dataURL + symbol + '/' + _granularity + '/' + _startDate +  '/' + _endDate + ts_appendURL
    _supplyChartData(symbol, queryUrl, cb, false)
  }

	// called by chart to fetch update data
  function fetchUpdateData(symbol, startDate, params, cb) {
    consoleLogHelper('fetchUpdateData', startDate, '', params)
		if( no_streamable_list.indexOf(symbol) == -1) {
			console.info('Chart update request ...')
			// if symbol is not in the 'no_streamable_list', proceed with update
		    _startDate = dateHelper.dateToDateStr(dateHelper.getPastDateFromDate(new Date(), 0) )
		    _endDate = dateHelper.dateToDateStr(new Date())
		    _granularity = '1M' // _getGranularity(params.period, params.interval, params.period)
		    var queryUrl = ts_dataURL + symbol + '/' + _granularity + '/' + _startDate +  '/' + _endDate + ts_appendURL
		    _supplyChartData(symbol, queryUrl, cb, true)
		}
  }


  /**
   *
   */
  function _supplyChartData(symbol, queryUrl, chartBuilder, addNewDataOnly) {
    console.log(queryUrl)
    CIQ.postAjax(queryUrl, null, function(status, response){
  		// process the HTTP response from the datafeed
  		if(status==200){ // if successful response from datafeed
        var rawChartData=JSON.parse(response)
        var formatedChartData = {}
        if(addNewDataOnly) {
          formatedChartData = _sliceAndGetNewDataOnly(rawChartData)
          //console.log(formatedChartData)
        }
        else {
  			  formatedChartData = _formatChartData(symbol, rawChartData)
        }
  			chartBuilder({quotes:formatedChartData, attribution:{source:"CNBC", exchange:"RANDOM"}}); // return the fetched data; init moreAvailable to enable pagination
  		} else { // else error response from datafeed
  			chartBuilder({error:status});	// specify error in callback
  		}
  	});
  }

  function _sliceAndGetNewDataOnly(rawChartData) {
    var slicedData = []
    var chartData = rawChartData.barData.priceBars
    /*
    for(var dd in chartData) {
      //if(data[dd] == )
      console.log(data[dd])
    }
    */
    var dd = chartData.length - 1
    if(dd < 0) {
      return nil
    }
    chartData2 = []
    var d = chartData[dd].tradeTime
    var newDate = d[0]+d[1]+d[2]+d[3]+'-'+d[4]+d[5]+'-'+d[6]+d[7]+' '+d[8]+d[9]+':'+d[10]+d[11]
    var UTCDate = new Date(newDate)

    chartData2[0] = {
      "Date"  : UTCDate,
      "Close" : parseFloat(chartData[dd].close),
      "Open"  : parseFloat(chartData[dd].open),
      "High"  : parseFloat(chartData[dd].high),
      "Low"   : parseFloat(chartData[dd].low),
      "Volume": parseInt(chartData[dd].volume)
    }
    return chartData2
  }

  function _formatChartData(symbol, rawChartData) {
    var chartData = rawChartData.barData.priceBars
		//var symbol = chartData
    var formatedChartData = []
    for(var dd in chartData) {

      var d = chartData[dd].tradeTime
      var dateString = d[0]+d[1]+d[2]+d[3]+'-'+d[4]+d[5]+'-'+d[6]+d[7]+' '+d[8]+d[9]+':'+d[10]+d[11]
      var UTCDate = new Date(dateString)

      formatedChartData[dd] = {
        "DT"    : UTCDate,
        "Close" : parseFloat(chartData[dd].close),
        "Open"  : parseFloat(chartData[dd].open),
        "High"  : parseFloat(chartData[dd].high),
        "Low"   : parseFloat(chartData[dd].low),
        "Volume": parseInt(chartData[dd].volume),
				[symbol]: parseFloat(chartData[dd].close)
      }
    }
		console.log("FORMATED CHART DATA")
		console.log(formatedChartData)
    return formatedChartData
  }

  function _getGranularity(interval, period) {
    var _period
    switch(period) {
      case 'minute':
        _period = 'M'
        break
      case 'day':
        _period = 'D'
        break
      case 'year':
        _period = 'Y'
    }
    return interval + _period
  }

  function _UTCDateToLocalDate(date) {
      var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
      var offset = date.getTimezoneOffset() / 60;
      var hours = date.getHours();
      newDate.setHours(hours - offset);
      return newDate;
  }

  function consoleLogHelper(type, start, end, params) {
    console.info("===============================\n" + type + "\n-------------------------------")
    console.log("interval:" + params.interval)
    console.log("period:" + params.period)
    console.table([ ["StartDate", start], ["EndDate", end] ])
  }

  return {
    fetchInitialData: fetchInitialData,
    fetchUpdateData: fetchUpdateData,
    fetchPaginationData: fetchPaginationData
  }
}

module.exports = DataConnector;