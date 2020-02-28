import DateHelper from './DateHelper';

function consoleLogHelper(type, start, end, params) {
  console.info(`===============================\n${type}\n-------------------------------`)
  console.log(`interval: ${params.interval}`)
  console.log(`period: ${params.period}`)
  console.table([['StartDate', start], ['EndDate', end]])
}

function getGranularity(intervalValue, period) {
  let interval
  switch (intervalValue) {
  case 'minute':
    interval = 'M'
    break
  case 'day':
    interval = 'D'
    break
  case 'year':
    interval = 'Y'
    break
  default: 
    interval = ''
    break
  }
  return `${period}${interval}`
}

const DataConnector = (config) => {
  const tsDataURL = config.time_series_api_url // http://ts-api.cnbc.com/harmony/app/bars/
  const tsAppendURL = config.time_series_append_url // /adjusted/EST5EDT.json
  const noStreamableList = config.no_streamable_list
  const CIQ = config.CIQ

  let startDate
  let endDate
  let granularity
  let lastUpdatedTime
  let lastUrl

  function formatChartData(rawChartData, sliceLastImportedData) {
    if (rawChartData.barData === null) return
    
    const chartData = rawChartData.barData.priceBars
    if (chartData.length === 0) return
    
    // const symbol = chartData
    const formatedChartData = []
    let dd = chartData.length
    for (dd; dd--; 0) {
      const UTCDate = DateHelper.dateStringToDateObject(chartData[dd].tradeTime)
      if (sliceLastImportedData === true && UTCDate < lastUpdatedTime) {
        console.log(UTCDate, lastUpdatedTime)
    		break
      }
      console.log('after break')
      formatedChartData[dd] = {
        DT: UTCDate,
        Close: parseFloat(chartData[dd].close),
        Open: parseFloat(chartData[dd].open),
        High: parseFloat(chartData[dd].high),
        Low: parseFloat(chartData[dd].low),
        Volume: chartData[dd].volume == null ? undefined : parseInt(chartData[dd].volume),
      }
    }
    const lastDataPoint = chartData.length - 1
    lastUpdatedTime = DateHelper.dateStringToDateObject(chartData[lastDataPoint].tradeTime)
    console.log('FORMATED CHART DATA')
    console.log(formatedChartData)
    return formatedChartData
  }

  function supplyChartData(queryUrl, chartBuilder, addNewDataOnly) {
    console.log(queryUrl)
    const processTimeSeriesResponseCallback = (status, response) => {
      // process the HTTP response from the datafeed
      if (status === 200) { // if successful response from datafeed
        const rawChartData=JSON.parse(response)
        let formatedChartData = {}
        if (addNewDataOnly) {
          formatedChartData = formatChartData(rawChartData, true)
          // console.log(formatedChartData)
        } else {
          formatedChartData = formatChartData(rawChartData, false)
        }

        if (lastUrl === queryUrl && addNewDataOnly === false) {
          console.log('herere')
          chartBuilder({ moreAvailable: false })
        } else {
          chartBuilder({ 
            quotes: formatedChartData, 
            attribution: { source: 'CNBC', exchange: 'RANDOM' } 
          }); // return the fetched data; init moreAvailable to enable pagination
        }
        lastUrl = queryUrl
        // return the fetched data; init moreAvailable to enable pagination
      } else { // else error response from datafeed
        chartBuilder({ error: status });	// specify error in callback
      }
    }
    const postAjaxParamsObj = {
      url: queryUrl,
      cb: processTimeSeriesResponseCallback,
      noEpoch: true, // tells chartiq to not use a cache burst query string
    }
    CIQ.postAjax(postAjaxParamsObj);
  }

  // called by chart to fetch initial data
  function fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    consoleLogHelper('fetchInitialData', suggestedStartDate, suggestedEndDate, params)

    if (config.noHistoryDataList.indexOf(symbol.toLowerCase()) !== -1) {
      const today = DateHelper.getBeginningOfTheDay()
      startDate = DateHelper.dateToDateStr(today)
    } else {
      startDate = DateHelper.dateToDateStr( suggestedStartDate)
    }
    endDate = DateHelper.dateToDateStr(DateHelper.getEndOfTheDay())
    granularity = getGranularity(params.interval, params.period)
    const queryUrl = `${tsDataURL}${symbol}/${granularity}/${startDate}/${endDate}${tsAppendURL}`
    supplyChartData(queryUrl, cb, false)
  }

  // called by chart to fetch pagination data
  function fetchPaginationData(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    consoleLogHelper('fetchPaginationData', suggestedStartDate, endDate, params)

    startDate = DateHelper.dateToDateStr(suggestedStartDate)
    endDate = DateHelper.dateToDateStr(DateHelper.getEndOfTheDay())
    granularity = getGranularity(params.interval, params.period)
    const queryUrl = `${tsDataURL}${symbol}/${granularity}/${startDate}/${endDate}${tsAppendURL}`
    supplyChartData(queryUrl, cb, false)
  }

  // called by chart to fetch update data
  function fetchUpdateData(symbol, suggestedStartDate, params, cb) {
    consoleLogHelper('fetchUpdateData', suggestedStartDate, '', params)
    if (noStreamableList.indexOf(symbol) === -1) {
      console.info('Chart update request ...')
      // if symbol is not in the 'noStreamableList', proceed with update
      startDate = DateHelper.dateToDateStr(DateHelper.getBeginningOfTheDay())
      endDate = DateHelper.dateToDateStr(DateHelper.getEndOfTheDay())
      granularity = getGranularity(params.interval, params.period)
      const queryUrl = `${tsDataURL}${symbol}/${granularity}/${startDate}/${endDate}${tsAppendURL}`
		  supplyChartData(queryUrl, cb, true)
    }
  }

  return {
    fetchInitialData,
    fetchUpdateData,
    fetchPaginationData
  }
}

export default DataConnector
