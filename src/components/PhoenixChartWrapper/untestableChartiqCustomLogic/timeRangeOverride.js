/* eslint-disable no-param-reassign, func-names */

import { CIQ } from 'chartiq/js/chartiq';
import adjustPeriodicitySelector from '../customChartLogic/adjustPeriodicitySelector';
import {
  weekendPremarketMultiplierValue,
  minInHours,
  firstPreMarketObjectEntry,
  timeZoneOffsetFromESTToUTC
} from '../chartConstants';

const timeRangeOverride = (chartEngine, initialSymbolData, preMarketOpen, preMarketPrevOpen) => {
  //debugger;
  CIQ.UI.ShowRange.prototype.setOriginal = CIQ.UI.ShowRange.prototype.set;
  CIQ.UI.ShowRange.prototype.set = function (activator, multiplier, base, interval, period) {
    $('cq-show-range div').removeClass('chartTimeIntervalSelected');
    $(`cq-show-range div:contains(${  activator.node.innerHTML  })`).addClass('chartTimeIntervalSelected');

    stxx.justSelectedTimeRange = true;

    const market = chartEngine.chart.market;
    const date = new Date();
    const oneYearMultiplierValue = 1;
    const fiveYearMultiplierValue = 5;
    let updatedBase = base;
    let updatedMultiplier = multiplier;

    function setExtendedHours() {
      const timeZoneOffset = date.getTimezoneOffset()/minInHours;
      const preMarketOpenOffset = market.normalHours[firstPreMarketObjectEntry].open_parts.hours + timeZoneOffsetFromESTToUTC - timeZoneOffset;
      if (market.isMarketDay()) {
        if (preMarketOpen > date && market.getOpen().getDay() === date.getDay() && preMarketOpenOffset <= date.getHours()) {
          // pre-market
          stxx.extendedHours.set(true);
          if (activator.node.innerHTML.toLowerCase() === '1d') {
            const timeToCallTimeout = 200;
            setTimeout(() => {
              chartEngine.setRange({
                dtLeft: preMarketPrevOpen,
                dtRight: preMarketOpen
              });
            }, timeToCallTimeout);
          }
          if (date.getDay() === 1) {
            base = 'day';
            multiplier = weekendPremarketMultiplierValue;
          }
        } else if (market.getClose() < date || market.getOpen() > date) {
          // post-market
          if (activator.node.innerHTML.toLowerCase() === '1d') {
            chartEngine.extendedHours.set(true, ['post']);
            if (date > market.getPreviousClose() && preMarketOpenOffset >= date.getHours()) {
              base = 'day';
            }
          } else {
            chartEngine.extendedHours.set(true);
          }
        }
      } else {
        chartEngine.extendedHours.set(true);
      }
    }

    if (activator.node.innerHTML.toLowerCase() === '1d') {
      // eslint-disable-next-line no-unused-expressions
      market.isMarketDay() && market.getOpen() < date ? updatedBase = 'today' : updatedMultiplier = weekendPremarketMultiplierValue;
    }

    const getTimeUnitValue = () => {
      if (base === 'today' || base === 'day') {
        return 'minute';
      } else if (base === 'month' || base === 'YTD' || (base === 'year' && multiplier === oneYearMultiplierValue)) {
        return 'day';
      } else if (base === 'year' && multiplier === fiveYearMultiplierValue) {
        return 'week';
      }
      return 'month';
    };

    const getPeriodValue = () => {
      const fiveMinutes = 5;
      const threeWeeksBar = 3;
      if (interval === 'minute') {
        return base === 'today' ? 1 : fiveMinutes;
      } else if (interval === 'day' || interval === 'week') {
        return 1;
      }
      return threeWeeksBar;
    };

    if (interval === undefined) {
      interval = getTimeUnitValue();
    }
    if (period === undefined) {
      period = getPeriodValue();
    }

    const isUSStock = initialSymbolData.type === 'STOCK' && initialSymbolData.countryCode === 'US';
    const oneWeekPeriodBarsClass = 'item-hide-1w';
    const oneMonthPeriodBarsClass = 'item-hide-1mo';
    switch (activator.node.innerHTML.toLowerCase()) {
    case '1d':
      adjustPeriodicitySelector(['item-hide-1m', 'item-hide-5m', 'item-hide-10m', 'item-hide-15m', 'item-hide-30m', 'item-hide-1h']);
      if (isUSStock) {
        setExtendedHours();
      }
      break;
    case '5d':
      adjustPeriodicitySelector(['item-hide-5m', 'item-hide-10m', 'item-hide-15m', 'item-hide-30m', 'item-hide-1h']);
      if (isUSStock) {
        setExtendedHours();
      }
      break;
    case '1m':
      adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass]);
      chartEngine.extendedHours.set(false);
      break;
    case '3m':
      adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
      break;
    case '6m':
      adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
      break;
    case 'ytd':
      adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
      break;
    case '1y':
      adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
      break;
    case '5y':
      adjustPeriodicitySelector([oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
      break;
    case 'all':
      adjustPeriodicitySelector([]);
      break;
    default:
      break;
    }
    this.setOriginal(activator, multiplier, base, interval, period);

    return {
      base: updatedBase,
      multiplier: updatedMultiplier,
      interval
    };
  };
};

export default timeRangeOverride;
