import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import QuoteFeed from './DataConnector';
import DateHelper from './DateHelper';
import { CIQ } from 'chartiq/js/chartiq';

const noHistoryDataList = ['.ftse', '.ftmib', '.ftsti', '.klse']

const feedConfig = {
  CIQ,
  quote_api_url: 'https://quote.cnbc.com/quote-html-webservice/quote.htm?exthrs=1&output=json&partnerId=2&1473869228859&symbols=',
  time_series_api_url: 'https://ts-api.cnbc.com/harmony/app/bars/',
  time_series_append_url: '/adjusted/EST5EDT.json',
  no_streamable_list: ['.DJIA'],
  noHistoryDataList,
}

const params = {
  additionalSessions: ["pre", "post"],
  behavior: {refreshInterval: 10, bufferSize: 200, maximumTicks: 20000, intervalTimer: 616},
  bufferSize: 200,
  extended: true,
  initializeChart: true,
  interval: "day",
  intervalTimer: 66,
  maximumTicks: 20000,
  originalState: {refreshInterval: 10, bufferSize: 200, maximumTicks: 20000, intervalTimer: 66},
  period: 1,
  refreshInterval: 10,
  symbol: "VOD-GB",
  symbolObject: {symbol: "VOD-GB"},
  ticks: 116,
}

const quoteFeed = new QuoteFeed(feedConfig); // setup the quoteFeed using time series API

describe('Testing Home component', () => {
    it('fetchInitialData for one day', () => {
      const oneDay = 86400000 // that is: 24 * 60 * 60 * 1000
      const startDate = new Date(Date.now() - oneDay);
      const endDate = new Date();

      const result = quoteFeed.fetchInitialData(params.symbolObject.symbol, startDate, endDate, params, {});

      const startDateStr = DateHelper.dateToDateStr(startDate);
      const endDateStr = DateHelper.dateToDateStr(DateHelper.getEndOfTheDay());
      const periodicity = '1D';

      const shouldMatch = `https://ts-api.cnbc.com/harmony/app/bars/${params.symbolObject.symbol}/${periodicity}/${startDateStr}/${endDateStr}/adjusted/EST5EDT.json`;
      expect(shouldMatch).toEqual(result.url);
   });
});
