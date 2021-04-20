/* eslint-disable no-param-reassign, func-names */
import adjustPeriodicitySelector from '../customChartLogic/adjustPeriodicitySelector';

/**
 * sets selected time range
 */
const setTimeRangeHighlight = () => {
  if (document.querySelector('cq-show-range > div.chartTimeIntervalSelected')) {
    document.querySelector('cq-show-range > div.chartTimeIntervalSelected').classList.remove('chartTimeIntervalSelected');
  }
  
  if (document.querySelector(`cq-show-range > .range-${window.stxx.selectedTimeRange}`)) {
    document.querySelector(`cq-show-range > .range-${window.stxx.selectedTimeRange}`).classList.add('chartTimeIntervalSelected');
  }
}

const timeRangeOverride = (selectedTimeRange) => {
  console.log(">>>> timeRangeOverride ");
  if(document.querySelector('.ciq-menu.ciq-period > cq-menu-dropdown > cq-menu-container').innerText === '') {
    // skip further actions if periodicity container is empty (on initial load)
    return;
  }
  stxx.justSelectedTimeRange = true;

  const oneWeekPeriodBarsClass = 'item-hide-1w';
  const oneMonthPeriodBarsClass = 'item-hide-1mo';

  setTimeRangeHighlight();

  switch (selectedTimeRange) {
    case '1today':
      adjustPeriodicitySelector(['item-hide-1min', 'item-hide-5min', 'item-hide-10min', 'item-hide-15min', 'item-hide-30min', 'item-hide-1hour']);
      break;
    case '5day':
      adjustPeriodicitySelector(['item-hide-5min', 'item-hide-10min', 'item-hide-15min', 'item-hide-30min', 'item-hide-1hour']);
      break;
    case '1month':
      adjustPeriodicitySelector(['item-hide-1d', oneWeekPeriodBarsClass]);
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
