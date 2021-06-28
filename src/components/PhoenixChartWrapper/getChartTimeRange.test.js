import getChartTimeRange from './getChartTimeRange';

describe('getChartTimeRange default return values', () => {
  global.stxx = {};
  it('should return 1D', () => {
    stxx.selectedTimeRange = '1today';
    expect(getChartTimeRange()).toBe('1D');
  });

  it('should return 1D', () => {
    stxx.selectedTimeRange = '1day';
    expect(getChartTimeRange()).toBe('1D');
  });

  it('should return 1D', () => {
    stxx.selectedTimeRange = '2day';
    expect(getChartTimeRange()).toBe('1D');
  });

  it('should return 5D', () => {
    stxx.selectedTimeRange = '5day';
    expect(getChartTimeRange()).toBe('5D');
  });

  it('should return 1M', () => {
    stxx.selectedTimeRange = '1month';
    expect(getChartTimeRange()).toBe('1M');
  });

  it('should return 3M', () => {
    stxx.selectedTimeRange = '3month';
    expect(getChartTimeRange()).toBe('3M');
  });

  it('should return 6M', () => {
    stxx.selectedTimeRange = '6month';
    expect(getChartTimeRange()).toBe('6M');
  });

  it('should return YTD', () => {
    stxx.selectedTimeRange = '1YTD';
    expect(getChartTimeRange()).toBe('YTD');
  });

  it('should return 1Y', () => {
    stxx.selectedTimeRange = '1year';
    expect(getChartTimeRange()).toBe('1Y');
  });

  it('should return 5Y', () => {
    stxx.selectedTimeRange = '5year';
    expect(getChartTimeRange()).toBe('5Y');
  });

  it('should return ALL', () => {
    stxx.selectedTimeRange = '1all';
    expect(getChartTimeRange()).toBe('ALL');
  });
});
