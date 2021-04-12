/* eslint-disable no-param-reassign, func-names */

import { CIQ } from 'chartiq/js/chartiq';
import adjustPeriodicitySelector from '../customChartLogic/adjustPeriodicitySelector';
import {
  weekendPremarketMultiplierValue,
  minInHours,
  firstPreMarketObjectEntry,
  timeZoneOffsetFromESTToUTC
} from '../chartConstants';

const timeRangeOverride = (params) => {

    const oneWeekPeriodBarsClass = 'item-hide-1w';
    const oneMonthPeriodBarsClass = 'item-hide-1mo';
    let periodicity = `${params.multiplier}${params.base}`;

    //periodicity = periodicity.replace(/(today)|(day)/i, 'd');
    //periodicity = `${params.multiplier}${periodicity}`;

    console.log("!!!!!!!!!!!!!!!!!!!!!!!", periodicity);
    /*
    switch (params) {
        case '1d':
          adjustPeriodicitySelector(['item-hide-1m', 'item-hide-5m', 'item-hide-10m', 'item-hide-15m', 'item-hide-30m', 'item-hide-1h']);
          break;
        case '5d':
          adjustPeriodicitySelector(['item-hide-5m', 'item-hide-10m', 'item-hide-15m', 'item-hide-30m', 'item-hide-1h']);
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
    */
};

export default timeRangeOverride;
