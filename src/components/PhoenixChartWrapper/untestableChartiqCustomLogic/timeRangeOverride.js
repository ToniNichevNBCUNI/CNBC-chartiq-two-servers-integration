/* eslint-disable no-param-reassign, func-names */

import { CIQ } from 'chartiq/js/chartiq';
import adjustPeriodicitySelector from '../customChartLogic/adjustPeriodicitySelector';
import {
  weekendPremarketMultiplierValue,
  minInHours,
  firstPreMarketObjectEntry,
  timeZoneOffsetFromESTToUTC
} from '../chartConstants';

const setTimeRangeHighlight = () => {
    document.querySelectorAll('cq-show-range > div').forEach( element => {
        element.classList.remove('chartTimeIntervalSelected');
    });
    if(document.querySelector(`cq-show-range > .range-${window.stxx.selectedTimeRange}`))
        document.querySelector(`cq-show-range > .range-${window.stxx.selectedTimeRange}`).classList.add('chartTimeIntervalSelected');
}

const timeRangeOverride = (params) => {

    const oneWeekPeriodBarsClass = 'item-hide-1w';
    const oneMonthPeriodBarsClass = 'item-hide-1mo';
    let periodicity = `${params.multiplier}${params.base}`;

    setTimeRangeHighlight();
    
    switch (periodicity) {
        case '1today':
          adjustPeriodicitySelector(['item-hide-1min', 'item-hide-5min', 'item-hide-10min', 'item-hide-15min', 'item-hide-30min', 'item-hide-1hour']);
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
