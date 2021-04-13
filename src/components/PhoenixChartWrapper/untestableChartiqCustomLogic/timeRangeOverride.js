/* eslint-disable no-param-reassign, func-names */

import { CIQ } from 'chartiq/js/chartiq';
import adjustPeriodicitySelector from '../customChartLogic/adjustPeriodicitySelector';
import {
  weekendPremarketMultiplierValue,
  minInHours,
  firstPreMarketObjectEntry,
  timeZoneOffsetFromESTToUTC
} from '../chartConstants';

/**
 * sets selected time range
 */
const setTimeRangeHighlight = () => {
    document.querySelectorAll('cq-show-range > div').forEach( element => {
        element.classList.remove('chartTimeIntervalSelected');
    });
    if(document.querySelector(`cq-show-range > .range-${window.stxx.selectedTimeRange}`))
        document.querySelector(`cq-show-range > .range-${window.stxx.selectedTimeRange}`).classList.add('chartTimeIntervalSelected');
}

const timeRangeOverride = (params) => {
    stxx.justSelectedTimeRange = true;

    const market = window.stxx.chart.market;
    const date = new Date();
    const oneYearMultiplierValue = 1;
    const fiveYearMultiplierValue = 5;
    let updatedBase = params.base;
    let updatedMultiplier = params.multiplier;
    let preMarketOpen;  // makes no sence but setExtendedHours breaks without it 
    let preMarketPrevOpen; // makes no sence but setExtendedHours breaks without it

    function setExtendedHours() {
        const timeZoneOffset = date.getTimezoneOffset()/minInHours;
        const preMarketOpenOffset = market.normalHours[firstPreMarketObjectEntry].open_parts.hours + timeZoneOffsetFromESTToUTC - timeZoneOffset;
        if (market.isMarketDay()) {
          if (preMarketOpen > date && market.getOpen().getDay() === date.getDay() && preMarketOpenOffset <= date.getHours()) {
            // This if block makes zero sence. It will never be executed, since `preMarketOpen` is never been instantiated in the original code so it has to be removed
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
              // multiplier = weekendPremarketMultiplierValue;
            }
          } else if (market.getClose() < date || market.getOpen() > date) {
            // post-market
            const period = `${params.multiplier}${params.base}`;
            if(period == '1today') {
              window.stxx.extendedHours.set(true, ['post']);
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

    const symbolData = window.stxx.chart.symbolObject;
    const isUSStock = symbolData.type === 'STOCK' && symbolData.countryCode === 'US';      
    const oneWeekPeriodBarsClass = 'item-hide-1w';
    const oneMonthPeriodBarsClass = 'item-hide-1mo';
    let periodicity = `${params.multiplier}${params.base}`;

    setTimeRangeHighlight();
    
    switch (periodicity) {
        case '1today':
          adjustPeriodicitySelector(['item-hide-1min', 'item-hide-5min', 'item-hide-10min', 'item-hide-15min', 'item-hide-30min', 'item-hide-1hour']);
          if (isUSStock) {
            setExtendedHours();
          }
          window.stxx.extendedHours.set(true);          
          break;
        case '5day':
          adjustPeriodicitySelector(['item-hide-5min', 'item-hide-10min', 'item-hide-15min', 'item-hide-30min', 'item-hide-1hour']);
          window.stxx.extendedHours.set(true);
          break;
        case '1month':
          adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass]);
          window.stxx.extendedHours.set(false);
          break;
        case '3month':
          adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
          break;
        case '6month':
          adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
          break;
        case '1ytd':
          adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
          break;
        case '1year':
          adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
          break;
        case '5year':
          adjustPeriodicitySelector([oneWeekPeriodBarsClass, oneMonthPeriodBarsClass]);
          break;
        case '1all':
          adjustPeriodicitySelector([]);
          break;
        default:
          break;
        }    
};

export default timeRangeOverride;
