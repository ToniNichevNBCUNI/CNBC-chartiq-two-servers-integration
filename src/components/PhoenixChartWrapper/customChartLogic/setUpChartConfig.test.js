import commonUSStockData from '../__mocks__/commonStock.json';
import FTSEStockData from '../__mocks__/FTSE.json';
import mutualFundData from '../__mocks__/mutualFund.json';
import config from '../__mocks__/mockConfig';
import setUpChartConfig from './setupChartConfig';

describe('setupChartConfig', () => {
  it('should return config with matching footer ranges and periodicity for us stocks', () => {
    const expectFooterRange = [
      { label: '1D', multiplier: 1, base: 'today', interval: 1, period: 1, timeUnit: 'minute', available: 'always' },
      { label: '5D', multiplier: 5, base: 'day', interval: 1, period: 5, timeUnit: 'minute', available: 'always' },
      { label: '1M', multiplier: 1, base: 'month' },
      { label: '3M', multiplier: 3, base: 'month' },
      { label: '6M', multiplier: 6, base: 'month' },
      { label: 'YTD', multiplier: 1, base: 'YTD' },
      { label: '1Y', multiplier: 1, base: 'year' },
      { label: '5Y', multiplier: 5, base: 'year', interval: 'week', period: 1, timeUnit: 'week' },
      { label: 'All', multiplier: 1, base: 'all', interval: 'month', period: 3 }
    ];
    const updatedConfig = setUpChartConfig(commonUSStockData, config);
    expect(updatedConfig.footerRange).toEqual(expectFooterRange);
  });

  it('should return config with matching footer ranges and periodicity for nohistory symbols', () => {
    const expectFooterRange = [
      { label: '1D', multiplier: 1, base: 'today', interval: 1, timeUnit: 'minute', available: 'always' }
    ];
    const updatedConfig = setUpChartConfig(FTSEStockData, config);
    expect(updatedConfig.footerRange).toEqual(expectFooterRange);
  });

  it('should return config with matching footer ranges and periodicity for mutual funds', () => {
    const expectFooterRange = [
      { label: '1M', multiplier: 1, base: 'month' },
      { label: '3M', multiplier: 3, base: 'month' },
      { label: '6M', multiplier: 6, base: 'month' },
      { label: 'YTD', multiplier: 1, base: 'YTD' },
      { label: '1Y', multiplier: 1, base: 'year' },
      { label: '5Y', multiplier: 5, base: 'year', interval: 'week', period: 1, timeUnit: 'week' },
      { label: 'All', multiplier: 1, base: 'all', interval: 'month', period: 3 }
    ];
    const updatedConfig = setUpChartConfig(mutualFundData, config);
    expect(updatedConfig.footerRange).toEqual(expectFooterRange);
  });
});
