import { CIQ } from 'chartiq/js/chartiq';

const setPeriodicityOverride = () => {
  CIQ.UI.Layout.prototype.setPeriodicityOriginal = CIQ.UI.Layout.prototype.setPeriodicity;
  CIQ.UI.Layout.prototype.setPeriodicity = function (node, periodicity, interval, timeUnit){
    if (stxx && stxx.dontRoll) {
      stxx.dontRoll = false;
    }

    const multiplier = stxx.currentMultiplier;
    const base = stxx.currentBase;
    const isFiveDayChart = base === 'day' && multiplier === '5';
    const periodOverride = isFiveDayChart ? periodicity/5 : periodicity;
    const intervalOverride = isFiveDayChart ? 5 : 1;

    if (base.includes('day')) {
      stxx.setSpan({
        multiplier,
        base,
        periodicity : {
          period: periodOverride,
          ...timeUnit.includes('day') ? { interval: intervalOverride } : {},
          timeUnit
        }
      })
    } else {
      const dataSegment = stxx.chart.dataSegment;
      const dtLeft = dataSegment[0].DT;
      const dtRight = dataSegment[dataSegment.length - 1].DT
      stxx.setRange({
        dtLeft,
        dtRight,
        periodicity: {
          period: periodOverride,
          ...timeUnit.includes('day') ? { interval: intervalOverride } : {},
          timeUnit
        },
        dontSaveRangeToLayout: true
      })
    }
  }
}

export default setPeriodicityOverride;
