import updateLastChartTick from './updateLastChartTick';

describe('updateLastChartTick', () => {
  const appendMasterDataMock = jest.fn();
  const chartEngineGlobalMock = {
    layout: {
      extended: false,
      setSpan: {
        periodicity: {
          period: 1
        }
      }
    },
    currentBase: 'day',
    chart: {
      dataSegment: [],
      market: {
        normalHours: [
          { open_parts: { hours: 4, minutes: 0 } },
          { open_parts: { hours: 4, minutes: 0 } },
          { open_parts: { hours: 4, minutes: 0 } },
          { open_parts: { hours: 4, minutes: 0 } },
          { open_parts: { hours: 4, minutes: 0 } },
          { open_parts: { hours: 4, minutes: 0 } },
        ]
      }
    },
    appendMasterData: appendMasterDataMock,
    updateChartData: appendMasterDataMock
  };

  global.stxx = chartEngineGlobalMock;
  const quoteDataMock = {
    last: '2',
    curmktstatus: 'REG_MKT',
    last_time: new Date(),
    ExtendedMktQuote: {
      last: '3',
      volume: '3'
    },
    volume: '3'
  };

  it('should not call appendMasterData since no chart data', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {};
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'POST_MKT';
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).not.toHaveBeenCalled();
  });

  it('should not call appendMasterData', () => {
    quoteDataMock.curmktstatus = 'REG_MKT';
    chartEngineGlobalMock.chart.dataSegment.push({
      DT: new Date(),
      Open: 1,
      High: 1,
      Low: 1,
      Close: 1,
      Volume: 2
    });
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).not.toHaveBeenCalled();
  });

  it('EXTD_MKT: should not call appendMasterData since no last data', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {};
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'POST_MKT';
    delete quoteDataMock.ExtendedMktQuote.last;
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).not.toHaveBeenCalled();
  });

  it('REG_MKT: should not call appendMasterData since no last data', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {};
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'REG_MKT';
    delete quoteDataMock.last;
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).not.toHaveBeenCalled();
  });

  it('REG_MKT: should not call appendMasterData since last data is the same', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {};
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'REG_MKT';
    quoteDataMock.last = '1';
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).not.toHaveBeenCalled();
  });

  it('daily chart: should call appendMasterData', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {
      period: 1
    };
    chartEngineGlobalMock.selectedTimeRange = '1today';
    chartEngineGlobalMock.layout.extended = true;
    quoteDataMock.curmktstatus = 'REG_MKT';
    quoteDataMock.last = '2';
    quoteDataMock.ExtendedMktQuote.last = '3';
    const dateMock = new Date();
    dateMock.setMinutes(dateMock.getMinutes() + 2);
    quoteDataMock.last_time = dateMock;
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).toHaveBeenCalledTimes(1);
  });

  it('daily chart: should call appendMasterData', () => {
    chartEngineGlobalMock.selectedTimeRange = '1today';
    chartEngineGlobalMock.layout.extended = true;
    quoteDataMock.curmktstatus = 'POST_MKT';
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).toHaveBeenCalledTimes(2);
  });

  it('daily chart: should call appendMasterData', () => {
    chartEngineGlobalMock.selectedTimeRange = '1today';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'POST_MKT';
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).toHaveBeenCalledTimes(3);
  });

  it('non daily chart: should call appendMasterData', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {
      period: 1
    };
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'REG_MKT';
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).toHaveBeenCalledTimes(4);
  });


  it('non daily chart: should call appendMasterData', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {
      period: 1
    };
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'REG_MKT';
    delete quoteDataMock.last_time;
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).toHaveBeenCalledTimes(5);
  });

  it('non daily chart: should call appendMasterData', () => {
    chartEngineGlobalMock.layout.setSpan.periodicity = {
      period: 1
    };
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'POST_MKT';
    quoteDataMock.last_time = new Date();
    delete quoteDataMock.volume;
    delete quoteDataMock.ExtendedMktQuote.volume;
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).toHaveBeenCalledTimes(6);
  });

  it('non daily chart: should call appendMasterData', () => {
    chartEngineGlobalMock.selectedTimeRange = '1month';
    chartEngineGlobalMock.layout.extended = false;
    quoteDataMock.curmktstatus = 'POST_MKT';
    const dateMock = new Date();
    dateMock.setDate(dateMock.getDate() - 1);
    const mockDataPointObj = {
      DT: dateMock,
      High: '1',
      Close: '1',
      Open: '1',
      Low: '1',
      Volume: 2,
    };
    chartEngineGlobalMock.chart.dataSegment.push(mockDataPointObj);
    updateLastChartTick(quoteDataMock, chartEngineGlobalMock);
    expect(appendMasterDataMock).toHaveBeenCalledTimes(7);
  });
});
