
// import { CIQ } from 'chartiq/js/chartiq';
import globalAppConfig from 'app/globalAppConfig';

import QuoteFeed from '../PhoenixChartWrapper/DataConnector';
import getChartTimeRange from './getChartTimeRange';
import DateHelper from '../PhoenixChartWrapper/DateHelper';
import noChartDataResponse from '../PhoenixChartWrapper/__mocks__/noChartDataResponse.json';
import chartDataResponse from '../PhoenixChartWrapper/__mocks__/validChartDataResponse.json';
import CIQ from './__mocks__/chartIq';
import { noHistoryDataList } from '../PhoenixChartWrapper/chartConstants';

const { TIME_SERIES_CHART_API, TIME_SERIES_BAR_API } = globalAppConfig.getProperties();

const feedConfig = {
  CIQ,
  timeSeriesAppendUrl: '/adjusted/EST5EDT.json',
  noHistoryDataList,
  quotePageSymbol: 'AAPL',
  noStreamableList: ['.DJIA'],
  symbol: 'AAPL'
};

const params = {
  additionalSessions: ['pre', 'post'],
  behavior: { refreshInterval: 10, bufferSize: 200, maximumTicks: 20000, intervalTimer: 616 },
  bufferSize: 200,
  extended: true,
  initializeChart: true,
  interval: 'day',
  intervalTimer: 66,
  maximumTicks: 20000,
  originalState: { refreshInterval: 10, bufferSize: 200, maximumTicks: 20000, intervalTimer: 66 },
  period: 1,
  refreshInterval: 10,
  symbol: 'VOD-GB',
  symbolObject: { symbol: 'VOD-GB', type: 'STOCK', name: 'TEST' },
  endDate: 'test-date',
  ticks: 116,
  stx: {
    chart: {
      market: {
        market_def: {
          name: 'NASDAQ'
        }
      }
    }
  }
};

const quoteFeed = new QuoteFeed(CIQ, feedConfig); // setup the quoteFeed using time series API
const oneDay = 86400000; // that is: 24 * 60 * 60 * 1000

describe('Testing DataConnector', () => {
  global.stxx = {};

  it('fetchInitialData for FTSE', () => {
    const startDate = DateHelper.getBeginningOfTheDay();
    const endDate = new Date();
    stxx.selectedTimeRange = '1today';
    const result = quoteFeed.fetchInitialData('.FTSE', startDate, endDate, params, () => {});
    const chartTimeRange = getChartTimeRange();
    const shouldMatch = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=.FTSE`;
    expect(shouldMatch).toEqual(result.url);
  });

  it('fetchInitialData for one day', () => {
    const startDate = new Date(Date.now() - oneDay);
    const endDate = new Date();
    const result = quoteFeed.fetchInitialData(params.symbolObject.symbol, startDate, endDate, params, () => {});
    const chartTimeRange = getChartTimeRange(startDate);
    const shouldMatch = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=${params.symbolObject.symbol}`;
    expect(shouldMatch).toEqual(result.url);
  });

  it('fetchInitialData for 5Y', () => {
    const startDate = new Date(Date.now() - oneDay);
    const endDate = new Date();
    const result = quoteFeed.fetchInitialData(params.symbolObject.symbol, startDate, endDate, params, () => {});
    const chartTimeRange = getChartTimeRange(startDate);
    const shouldMatch = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=${params.symbolObject.symbol}`;
    expect(shouldMatch).toEqual(result.url);
  });

  it('fetchInitialData for 24 hour market', () => {
    params.stx.chart.market.market_def.name = '24 Hour Market';
    const startDate = new Date(Date.now() - oneDay * 60);
    const endDate = new Date();
    const chartTimeRange = getChartTimeRange(startDate, true);
    const shouldMatch = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=${params.symbolObject.symbol}`;
    const result = quoteFeed.fetchInitialData(params.symbolObject.symbol, startDate, endDate, params, () => {});
    expect(shouldMatch).toEqual(result.url);
  });

  it('fetchInitialData returns since no type in symbolobject', () => {
    global.stxx = undefined;
    const startDate = new Date(Date.now() - oneDay);
    const endDate = new Date();
    const result = quoteFeed.fetchInitialData(params.symbolObject.symbol, startDate, endDate, params, () => {});
    expect(result).toEqual(undefined);
    global.stxx = {};
  });

  it('fetchPaginationData for five days', () => {
    const startDate = new Date(Date.now() - (oneDay * 5));
    const endDate = new Date();
    const result = quoteFeed.fetchPaginationData(params.symbolObject.symbol, startDate, endDate, params, () => {});
    const startDateStr = DateHelper.dateToDateStr(startDate);
    const endDateStr = DateHelper.dateToDateStr(DateHelper.getEndOfTheDay());
    const periodicity = '1D';
    const shouldMatch = `${TIME_SERIES_BAR_API}/${params.symbolObject.symbol}/${periodicity}/${startDateStr}/${endDateStr}/adjusted/EST5EDT.json?type=scroll`;
    expect(shouldMatch).toEqual(result.url);
  });

  it('should not return fetchPaginationData for FTSE', () => {
    const startDate = new Date(Date.now() - (oneDay * 5));
    const endDate = new Date();
    const result = quoteFeed.fetchPaginationData('.ftse', startDate, endDate, params, () => {});
    expect(result).toEqual(undefined);
  });

  it('fetchUpdateData', () => {
    global.stxx = { chart: { symbol: params.symbolObject.symbol } };
    stxx.selectedTimeRange = '1today';
    const startDate = new Date(Date.now());
    const result = quoteFeed.fetchUpdateData(params.symbolObject.symbol, startDate, params, () => {});
    const chartTimeRange = getChartTimeRange(startDate);
    const shouldMatch = `${TIME_SERIES_CHART_API}/${chartTimeRange}.json?symbol=${params.symbolObject.symbol}`;
    expect(shouldMatch).toEqual(result.url);
  });

  it('should not fetchUpdateData for .DJIA', () => {
    const startDate = new Date(Date.now() - oneDay);
    const result = quoteFeed.fetchUpdateData('.DJIA', startDate, params, () => {});
    expect(result).toBe(undefined);
  });

  it('should return nothing since empty data response', () => {
    const formattedData = quoteFeed.formatChartData(noChartDataResponse);
    expect(formattedData).toStrictEqual([]);
  });

  it('should return undefined since no chartbuilder', () => {
    const mockDependencies = {
      cb: null,
      shouldRequestBeMadeObj: null
    };
    const res = quoteFeed.processTimeSeriesResponseCallback(404, JSON.stringify(chartDataResponse), mockDependencies);
    expect(res).toBe(undefined);
  });

  it('should return undefined since no chartbuilder', () => {
    const res = quoteFeed.processTimeSeriesResponseCallback(404, JSON.stringify(chartDataResponse), null);
    expect(res).toBe(undefined);
  });

  it('should call chartbuilder with expected values', () => {
    const chartBuilderMock = jest.fn();
    const mockDependencies = {
      cb: chartBuilderMock,
      shouldRequestBeMadeObj: {
        addNewDataOnly: false,
        fromInitialDataRequest: true
      }
    };
    quoteFeed.processTimeSeriesResponseCallback(200, JSON.stringify(chartDataResponse), mockDependencies);
    const expectedData = quoteFeed.formatChartData(chartDataResponse);
    expect(chartBuilderMock).toHaveBeenCalledWith({
      quotes: expectedData,
      attribution: { source: 'CNBC' },
      moreAvailable: false,
    });
  });


  it('should call chartbuilder with expected values', () => {
    const chartBuilderMock = jest.fn();
    const mockDependencies = {
      cb: chartBuilderMock,
      shouldRequestBeMadeObj: {
        addNewDataOnly: true,
        fromInitialDataRequest: true
      }
    };
    quoteFeed.processTimeSeriesResponseCallback(200, JSON.stringify(chartDataResponse), mockDependencies);
    expect(chartBuilderMock).toHaveBeenCalledWith({
      quotes: [],
      attribution: { source: 'CNBC' },
      moreAvailable: false,
    });
  });

  it('should call chartbuilder with moreAvailable: false', () => {
    const chartBuilderMock = jest.fn();
    const mockDependencies = {
      cb: chartBuilderMock,
      shouldRequestBeMadeObj: {
        addNewDataOnly: false,
        fromInitialDataRequest: false
      }
    };
    const expectedData = quoteFeed.formatChartData(chartDataResponse);
    quoteFeed.processTimeSeriesResponseCallback(200, JSON.stringify(chartDataResponse), mockDependencies);
    expect(chartBuilderMock).toHaveBeenCalledWith({ quotes: expectedData, moreAvailable: false });
  });

  it('should call chartbuilder with error: 404', () => {
    const chartBuilderMock = jest.fn();
    const mockDependencies = {
      cb: chartBuilderMock,
      shouldRequestBeMadeObj: null
    };
    quoteFeed.processTimeSeriesResponseCallback(404, JSON.stringify(chartDataResponse), mockDependencies);
    expect(chartBuilderMock).toHaveBeenCalledWith({ error: 404 });
  });

  it('should return nothing since no data', () => {
    const formattedData = quoteFeed.formatChartData({ barData: null });
    expect(formattedData).toStrictEqual([]);
  });

  it('should return array there is data', () => {
    const formattedData = quoteFeed.formatChartData(chartDataResponse, true);
    expect(Array.isArray(formattedData)).toBe(true);
  });
});

describe('getGranularity', () => {
  it('should return 3MO', () => {
    const dateFrom1980 = new Date(1980, 10, 1);
    expect(quoteFeed.getGranularity('1d', 2, dateFrom1980)).toBe('3MO');
  });

  it('should return 1M', () => {
    const dateFrom2010 = new Date(2010, 10, 1);
    expect(quoteFeed.getGranularity('minute', 1, dateFrom2010)).toBe('1M');
  });

  it('should return 2Y', () => {
    const dateFrom2015 = new Date(2015, 10, 1);
    expect(quoteFeed.getGranularity('year', 2, dateFrom2015)).toBe('2Y');
  });

  it('should return 5D', () => {
    const dateFrom2015 = new Date(2015, 10, 1);
    expect(quoteFeed.getGranularity('day', 5, dateFrom2015)).toBe('5D');
  });
});
