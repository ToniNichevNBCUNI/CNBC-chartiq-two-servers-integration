const getChartTimeRange = () => {
  const timeRangeHarmonyAPIKeyMap = {
    '1today': '1D',
    '1day': '1D',
    '2day': '1D',
    '5day': '5D',
    '1month': '1M',
    '3month': '3M',
    '6month': '6M',
    '1ytd': 'YTD',
    '1year': '1Y',
    '5year': '5Y',
    '1all': 'ALL'
  };

  const selectedTimeRange = stxx.selectedTimeRange.toLowerCase() || '1today';
  return timeRangeHarmonyAPIKeyMap[selectedTimeRange];
};

export default getChartTimeRange;
