import { CIQ } from 'chartiq/js/chartiq';

const getXAxisDisplayValue = () => {
  const xAxisDisplayValues = {
    '1today': { timeUnit: CIQ.MINUTE, timeUnitMultiplier: 60 },
    '1day': { timeUnit: CIQ.HOUR, timeUnitMultiplier: 60 },
    '2day': { timeUnit: CIQ.MINUTE, timeUnitMultiplier: 60 },
    '5day': { 
      timeUnit: stxx.isAppChart && !stxx.isFullScreen ? CIQ.DAY : CIQ.HOUR, 
      timeUnitMultiplier: stxx.isAppChart && !stxx.isFullScreen ? 1 : 12 
    },
    '1month': { timeUnit: CIQ.DAY, timeUnitMultiplier: 7 },
    '3month': { timeUnit: CIQ.DAY, timeUnitMultiplier: 14 },
    '6month': { timeUnit: CIQ.MONTH, timeUnitMultiplier: 1 },
    '1ytd': { timeUnit: CIQ.MONTH, timeUnitMultiplier: stxx.isAppChart && !stxx.isFullScreen ? 3 : 1 },
    '1year': { timeUnit: CIQ.MONTH, timeUnitMultiplier: 1 },
    '5year': { timeUnit: stxx.isAppChart ? CIQ.YEAR : CIQ.MONTH, timeUnitMultiplier: stxx.isAppChart ? 1 : 6 },
  };

  const selectedTimeRange = stxx.selectedTimeRange.toLowerCase();
  return xAxisDisplayValues[selectedTimeRange];
};

const chartXAxisOverride = () => {
  CIQ.ChartEngine.prototype.prepend("createXAxis", function(chart) {
    var axisRepresentation = this.createTickXAxisWithDates(chart);
    var newAxisRepresentation=[];
    for (var i = 0; i < axisRepresentation.length; i++) {
      // adjust this buffer size (20)  as needed to manage the display of the left-most label.
      if(axisRepresentation[i].hz < 20) continue; 
      
      //adjust this buffer size (10)  as needed to manage the display of the right-most label.
      if(axisRepresentation[i].hz > this.chart.width-10) continue;
      
      newAxisRepresentation.push(axisRepresentation[i]);
    }
    return newAxisRepresentation;
  });

  CIQ.ChartEngine.prototype.prepend("drawXAxis", function(chart){
    const xAxisDisplayValues = getXAxisDisplayValue();

    if (xAxisDisplayValues) {
      stxx.chart.xAxis.timeUnit = xAxisDisplayValues.timeUnit;
      stxx.chart.xAxis.timeUnitMultiplier = xAxisDisplayValues.timeUnitMultiplier;
    } else {
      stxx.chart.xAxis.timeUnit = null;
      stxx.chart.xAxis.timeUnitMultiplier = null;
    }
  });
}

export default chartXAxisOverride;