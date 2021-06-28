import { CIQ } from 'chartiq/js/chartiq';
import getPeriodicity from '../customChartLogic/getPeriodicity';
import setExtendedHours from './setExtendedHours';
import updateAvailablePeriodicity from './updateAvailablePeriodicity';

const setSpanOverride = () => {
  CIQ.ChartEngine.prototype.setSpanOriginal = CIQ.ChartEngine.prototype.setSpan;
  CIQ.ChartEngine.prototype.setSpan = function (params, cb) {
    // Custom logic to defalt periodicity to 1minute for 1 day timespan
    const symbolObject = stxx.chart.symbolObject;
    const isRegMkt = symbolObject.curmktstatus === 'REG_MKT';
    const isPostMkt = symbolObject.curmktstatus === 'POST_MKT';
    const isPreMkt = symbolObject.curmktstatus === 'PRE_MKT'
    stxx.selectedTimeRange = `${params.multiplier}${params.base}`;
    stxx.currentBase = params.base;
    stxx.currentMultiplier = params.multiplier;
    params.forceLoad = true
    if (stxx && !stxx.dontRoll) {
      stxx.dontRoll = true;
    }

    // define periodicity if not set
    if (!params.periodicity) {
      if (typeof params.multiplier !== 'string') {
        params.multiplier = `${params.multiplier}`;
      }
      params.periodicity = getPeriodicity(params.base, params.multiplier);
    }

    //logic to turn off or no extended hours per time
    if (
      !isRegMkt &&
      params.base.includes('day') &&
      (!stxx.isAfterPostMarket || !stxx.isPreMarket)
    ) {
      if (isPreMkt) { 
        params.base = 'day';
      }
      setExtendedHours(symbolObject, params);
    } else {
      stxx.extendedHours.set(false)
    }

    if(!stxx.isAppChart) {
      updateAvailablePeriodicity(stxx.selectedTimeRange);
    } else if (params.base.includes('day') && params.multiplier === '1') {
      if (params.base !== 'today' && (isRegMkt || isPostMkt)) {
        params.base = 'today';
      }
      params.periodicity.period = 5;
    }

    const updatedCallback = () => {
      if (cb) { cb(); }

      if (!stxx.isAppChart) {
        if (params.base !== 'today') {
          stxx.home({ maintainWhitespace: false });
        }
      } else {
        if (params.base.includes('day') && params.multiplier === '1') {
          stxx.chart.container.style.display = 'none'
          if (stxx.chartInitialized) {
            setTimeout(() => stxx.chart.container.style.display = 'block', 200);
          }
          return;
        } else {
          stxx.home({ maintainWhitespace: false });
        }
      }
      stxx.justSelectedTimeRange = false;
    }
    console.log(params);
    this.setSpanOriginal(params, updatedCallback);
  };
}

export default setSpanOverride;
