import nativeSdkBridge from './nativeSdkBridge';
import CIQ from '../__mocks__/chartIq';

describe('nativeSdkBridge.updateChartLastPrice', () => {
  global.stxx = {
    updateChartData: jest.fn(),
    masterData: [],
    chart: {
      dataSegment: [{ Open: '1', High: '1', Low: '1', Close: '1', Volume: '1', DT: 'time' }]
    }
  };
  const nativeSdkBridgeMock = nativeSdkBridge(CIQ);
  it('should call updateChartLastPrice', () => {
    const appendMasterDataSpy = jest.spyOn(global.stxx, 'updateChartData')
    nativeSdkBridgeMock.updateChartLastPrice('2')
    expect(appendMasterDataSpy).toHaveBeenCalledTimes(1)
  })
})
