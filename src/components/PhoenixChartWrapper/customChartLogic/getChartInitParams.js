/* eslint-disable no-param-reassign */
import { CIQ } from 'chartiq/js/chartiq';
import adjustPeriodicitySelector from './adjustPeriodicitySelector';
import { weekendPremarketMultiplierValue } from '../chartConstants';
import marketFactory from '../marketFactory';

const getChartInitParams = (
  symbolData,
  chartEngine,
  appChart = false,
  date = undefined
) => {
  let base = 'today';
  let multiplier = 1;
  let timeUnit = 'minute';

  chartEngine.setMarket(marketFactory(symbolData));
  const market = chartEngine.chart.market;

  if (
    symbolData.type === 'STOCK' &&
    symbolData.countryCode === 'US' &&
    symbolData.subType !== 'Exchange Traded Fund'
  ) {
    let currentDate;
    let timeZoneOffset;
    if (!date) {
      currentDate = new Date();
      timeZoneOffset = currentDate.getTimezoneOffset()/60;
    } else {
      currentDate = date;
      timeZoneOffset = currentDate.getTimezoneOffset()/60;
    }
    const preMarketOpenOffset = market.normalHours[5].open_parts.hours + 4 - timeZoneOffset;

    if (market.isMarketDay()) {
      if (
        market.getOpen() > currentDate &&
        market.getOpen().getDay() === currentDate.getDay() &&
        preMarketOpenOffset <= currentDate.getHours()
      ) {
        // these lines may be used in the future
        // preMarketPrevOpen = chartEngine.convertToDataZone(market.getPreviousOpen());
        // preMarketOpen = chartEngine.convertToDataZone(market.getOpen());
        base = 'day';
        chartEngine.extendedHours.set(true);
        // Check to see if monday then use check from else statement since no data on weekend
        if (currentDate.getDay() === 1) {
          multiplier = weekendPremarketMultiplierValue;
        }
      } else if (market.getClose() < currentDate || market.getOpen() > currentDate) {
        chartEngine.extendedHours.set(true, ['post']);
      }
    } else {
      // this will default show pre and post market data
      chartEngine.extendedHours.set(true);
      base = 'day';
      multiplier = weekendPremarketMultiplierValue; // force 2 days on weekends and holidays to ensure data is displayed.
    }
    // Volume Underlay applied only for us stocks not etfs
    if (CIQ.Studies && CIQ.Studies.addStudy && !appChart) {
      CIQ.Studies.addStudy(chartEngine, 'vol undr', {}, {
        'Down Volume': '#e0352b',
        'Up Volume': '#31a745'
      }, {
        heightPercentage: 0.25,
        widthFactor: .05
      });
    }
  } else {
    if (symbolData.subType === 'Exchange Traded Fund') {
      // these lines may be used in the future
      // preMarketPrevOpen = market.getPreviousOpen();
      // preMarketOpen = market.getOpen();
    }
    // 1 year
    base = 'year';
    timeUnit = 'day';
    if (symbolData.type === 'FUND') {
      $('cq-show-range div:nth-child(5)').addClass('chartTimeIntervalSelected');
    } else {
      $('cq-show-range div:nth-child(7)').addClass('chartTimeIntervalSelected');
    }

    adjustPeriodicitySelector(['item-hide-1d', 'item-hide-1w', 'item-hide-1mo']);
  }
  return {
    span: { base, multiplier },
    periodicity: { period: 1, interval: 1, timeUnit }
  };
};

export default getChartInitParams;
