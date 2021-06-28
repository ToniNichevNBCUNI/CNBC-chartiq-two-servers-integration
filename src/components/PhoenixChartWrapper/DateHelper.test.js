import DateHelper from './DateHelper';

describe('DateHelper', () => {
  it('should return correct getBeginningOfTheDay value', () => {
    const date = new Date();
    const expectedStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), '00', '00', '0', '0');
    expect(DateHelper.getBeginningOfTheDay()).toStrictEqual(expectedStartDate);
  });

  it('should return correct getEndOfTheDay value', () => {
    const date = new Date();
    const expectedStartDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), '00', '00', '0', '0');
    expect(DateHelper.getEndOfTheDay()).toStrictEqual(expectedStartDate);
  });

  it('should return correct getPastDateFromDate value', () => {
    const date = new Date();
    const daysAgo = 7;
    const expectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysAgo, '00', '00', '0', '0');
    expect(DateHelper.getPastDateFromDate(date, daysAgo)).toStrictEqual(expectedDate);
  });

  it('should return 19800101000000 since date is before fixedstartDate', () => {
    const date = new Date(1984, 1, 1);
    const expectedDate = '19800101000000';
    expect(DateHelper.dateToDateStr(date)).toStrictEqual(expectedDate);
  });

  it('should return a month after date since date is before fixedstartDate', () => {
    const date = new Date(2000, 10, 1);
    const expectedDate = '20001101000000';
    expect(DateHelper.dateToDateStr(date)).toStrictEqual(expectedDate);
  });

  it('should convert date string to date object correctly', () => {
    const d = '20200804041000';
    const newDate = `${d[0] + d[1] + d[2] + d[3]  }/${  d[4]  }${d[5]  }/${  d[6]  }${d[7]  } ${  d[8]  }${d[9]  }:${  d[10]  }${d[11]}`;
    const expectedDateObject = new Date(newDate);
    expect(DateHelper.dateStringToDateObject(d)).toStrictEqual(expectedDateObject);
  });
});
