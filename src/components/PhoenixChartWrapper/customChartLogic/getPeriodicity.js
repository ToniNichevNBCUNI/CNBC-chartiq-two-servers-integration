import {
  dayTimeUnit,
  weekTimeUnit,
  monthTimeUnit,
  minuteTimeUnit,
  periodOrIntervalOne,
  periodOrIntervalThree,
  periodOrIntervalFive,
} from '../chartConstants';

const getPeriodicity = (base, multiplier) => {
  let period = periodOrIntervalOne;
  let interval = periodOrIntervalOne;
  let timeUnit = minuteTimeUnit;

  if (base === 'day' && multiplier === '5') {
    interval = periodOrIntervalFive;
    period = periodOrIntervalOne;
    timeUnit = minuteTimeUnit;
  } else if (base === 'month' || base === 'ytd') {
    interval = periodOrIntervalOne;
    period = periodOrIntervalOne;
    timeUnit = dayTimeUnit;
  } else if (base === 'year') {
    if (multiplier === '1') {
      timeUnit = dayTimeUnit;
      interval = periodOrIntervalOne;
      period = periodOrIntervalOne;
    } else {
      interval = periodOrIntervalOne;
      period = periodOrIntervalOne;
      timeUnit = weekTimeUnit;
    }
  } else if (base === 'all') {
    timeUnit = monthTimeUnit;
    period = periodOrIntervalOne;
    interval = periodOrIntervalThree;
  }

  return {
    period,
    interval,
    timeUnit
  };
};

export default getPeriodicity;
