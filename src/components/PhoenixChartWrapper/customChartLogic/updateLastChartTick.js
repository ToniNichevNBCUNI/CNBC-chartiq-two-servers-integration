import setExtendedHours from '../untestableChartiqCustomLogic/setExtendedHours';

const updateLastChartTick = (quoteData, chartEngineGlobal) => {
  let lastSymbolValue;
  let lastTimeValue;
  const replaceCommaRegex = /,/gi;

  if (quoteData.curmktstatus !== 'REG_MKT') {
    if (!quoteData.ExtendedMktQuote.last) {
      return;
    }
    lastSymbolValue = parseFloat(quoteData.ExtendedMktQuote.last.replace(replaceCommaRegex, ''));
    if (
      !chartEngineGlobal.layout.extended && (
        chartEngineGlobal.currentBase === 'today' ||
        chartEngineGlobal.currentBase === 'day'
      )
    ) {
      setExtendedHours(quoteData);
    }
  } else {
    if (!quoteData.last) {
      return;
    }
    lastSymbolValue = parseFloat(quoteData.last.replace(replaceCommaRegex, ''));
    lastTimeValue = quoteData.last_time ? new Date(quoteData.last_time) : null;
    if (
      chartEngineGlobal.layout.extended && (
        chartEngineGlobal.currentBase === 'today' ||
        chartEngineGlobal.currentBase === 'day'
      )
    ) {
      setExtendedHours(quoteData);
    }
  }

  const chartDataLastPoint = chartEngineGlobal.chart.dataSegment[chartEngineGlobal.chart.dataSegment.length -1];

  if (!chartDataLastPoint) {
    return;
  }
  if (
    chartDataLastPoint.Close !== null &&
    lastSymbolValue !== chartDataLastPoint.Close
  ) {
    const isDayTimeRange = chartEngineGlobal.selectedTimeRange.includes('day');
    const lastChartTime = chartDataLastPoint.DT;
    const periodicity = chartEngineGlobal.layout.setSpan?.periodicity?.period;
    if (isDayTimeRange) {
      if (!lastTimeValue) {
        lastTimeValue = lastChartTime;
      }
      const isSameTimeAsLastTick = lastTimeValue && lastTimeValue.getHours() <= lastChartTime.getHours() && lastTimeValue.getMinutes() < lastChartTime.getMinutes() + periodicity;
      chartEngineGlobal.appendMasterData(
        [{
          DT: isSameTimeAsLastTick ? lastChartTime : lastTimeValue,
          Open: chartDataLastPoint.Open,
          High: chartDataLastPoint.High,
          Low: chartDataLastPoint.Low,
          Close: lastSymbolValue,
          Volume: chartDataLastPoint.Volume
        }]
      );
    } else {
      if (!periodicity) {
        return;
      }
      if (!lastTimeValue) {
        lastTimeValue = quoteData.last_time ? new Date(quoteData.last_time) : null;
      }
      const isSameTimeAsLastTick = lastTimeValue && lastTimeValue.getDay() === lastChartTime.getDay();
      const marketHoursVolume = quoteData?.volume ? parseFloat(quoteData.volume.replace(replaceCommaRegex, '')) : 0;
      const extendedHoursVolume = quoteData?.ExtendedMktQuote?.volume ? parseFloat(quoteData.ExtendedMktQuote.volume.replace(replaceCommaRegex, '')) : 0;
      const lastTotalVolume = marketHoursVolume + extendedHoursVolume;

      chartEngineGlobal.appendMasterData(
        [{
          DT: isSameTimeAsLastTick ? lastChartTime : lastTimeValue,
          Open: lastSymbolValue,
          High: lastSymbolValue,
          Low: lastSymbolValue,
          Close: lastSymbolValue,
          Volume: lastTotalVolume
        }]
      );
    }
  }
};

export default updateLastChartTick;
