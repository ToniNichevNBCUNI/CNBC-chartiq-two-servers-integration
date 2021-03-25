import getPeriodicity from './getPeriodicity';

describe('getPeriodicity', () => {
  it('should return correct object for today', () => {
    const expectedObject = {
      period: 1,
      interval: 1,
      timeUnit: 'minute'
    };

    expect(getPeriodicity('today', '1')).toStrictEqual(expectedObject);
  });

  it('should return correct object for 5day', () => {
    const expectedObject = {
      period: 1,
      interval: 5,
      timeUnit: 'minute'
    };

    expect(getPeriodicity('day', '5')).toStrictEqual(expectedObject);
  });

  it('should return correct object for 1month', () => {
    const expectedObject = {
      period: 1,
      interval: 1,
      timeUnit: 'day'
    };

    expect(getPeriodicity('month', '1')).toStrictEqual(expectedObject);
  });

  it('should return correct object for ytd', () => {
    const expectedObject = {
      period: 1,
      interval: 1,
      timeUnit: 'day'
    };

    expect(getPeriodicity('ytd', '1')).toStrictEqual(expectedObject);
  });

  it('should return correct object for 1year', () => {
    const expectedObject = {
      period: 1,
      interval: 1,
      timeUnit: 'day'
    };

    expect(getPeriodicity('year', '1')).toStrictEqual(expectedObject);
  });

  it('should return correct object for 5year', () => {
    const expectedObject = {
      period: 1,
      interval: 1,
      timeUnit: 'week'
    };

    expect(getPeriodicity('year', '5')).toStrictEqual(expectedObject);
  });

  it('should return correct object for all', () => {
    const expectedObject = {
      period: 1,
      interval: 3,
      timeUnit: 'month'
    };

    expect(getPeriodicity('all', 1)).toStrictEqual(expectedObject);
  });
});
