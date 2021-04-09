import { CIQ } from 'chartiq/js/chartiq';
import getPeriodicity from '../customChartLogic/getPeriodicity';
import setExtendedHours from './setExtendedHours';

const setSpanOverride = () => {
  CIQ.ChartEngine.prototype.setSpanOriginal = CIQ.ChartEngine.prototype.setSpan;
  CIQ.ChartEngine.prototype.setSpan = function (params, cb) {
      // Custom logic to defalt periodicity to 1minute for 1 day timespan
      const symbolObject = stxx.chart.symbolObject;
      params.forceLoad = true
      if (stxx && !stxx.dontRoll) {
        stxx.dontRoll = true;
      }

      if (!params.periodicity) {
        if (typeof params.multiplier !== 'string') {
          params.multiplier = `${params.multiplier}`;
        }
        params.periodicity = getPeriodicity(params.base, params.multiplier);
      }

      if (
        symbolObject.curmktstatus !== 'REG_MKT' &&
        params.base.includes('day') &&
        (!stxx.isPostMarket || !stxx.isPreMarket)
      ) {
        setExtendedHours(symbolObject, params);
      }

      if ((stxx.isPostMarket || stxx.isPreMarket) && !params.base.includes('day')) {
        stxx.extendedHours.set(false)
      }

      const updatedCallback = () => {
        if (cb) { cb(); }

        if (!stxx.isAppChart) {
          if (params.base !== 'today') {
            stxx.home({ maintainWhitespace: false });
          }
        } else {
          if (
            (params.base.includes('day')) &&
            params.multiplier === '1'
          ) {
            return;
          } else {
            stxx.home({ maintainWhitespace: false });
          }
        }
        stxx.justSelectedTimeRange = false;
      }

      stxx.selectedTimeRange = `${params.multiplier}${params.base}`;
      stxx.currentBase = params.base;
      stxx.currentMultiplier = params.multiplier;
      console.log('setSpan')
      this.setSpanOriginal(params, updatedCallback);
  };
}

export default setSpanOverride;
