import LookupDriver, { sendRequest, convertAllSymbolsFormat } from '.'
import mockResponse from './mockResponse.json'
import mockSymbolsFormatted from './mockSymbolsFormatted'

const mockChartEngine = {
  addSeries: jest.fn(() => {})
}

const driver = new LookupDriver(mockChartEngine)
const badurl = new URL('https://httpstat.us/500')

function json() {
  return this.body
}

describe('ChartIQ LookupDriver', () => {
  beforeEach(() => {

    const fetchMock = (url) => (
      // fetch ALWAYS RESOLVES, even when response contains HTTP error code
      new Promise((resolve) => {
        if (url.host === badurl.host) {
          resolve({ status: 500, ok: false, body: [], json })
        }
        resolve({ status: 200, ok: true, body: mockResponse, json })
      })
    )
    global.fetch = jest.fn().mockImplementation(fetchMock)
  })

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  })

  it('should create correct url', () => {
    expect(driver.createRequestURL('AAPL', 5).href).toEqual(`${driver.url}?prefix=AAPL&maxresult=5`)
    expect(driver.createRequestURL('TSLA', 20).href).toEqual(`${driver.url}?prefix=TSLA&maxresult=20`)
  })

  it('fetches data from server', async () => {
    const testUrl = new URL('https://google.com')
    sendRequest(testUrl)
    
    expect(global.fetch.mock.calls.length).toBe(1)
    expect(global.fetch.mock.calls[0][0]).toBe(testUrl)
    
    const response = await global.fetch.mock.results[0].value
    expect(response.ok).toBeTruthy()
  })

  it('handles good server responses', async () => {
    const mockCallback = jest.fn(() => {})
    await driver.acceptText('AAPL', undefined, 20, mockCallback)
    expect(mockCallback.mock.calls[0][0]).toEqual(mockSymbolsFormatted)
    expect(mockCallback.mock.calls.length).toBe(1)
  })
  
  it('handles bad server responses', async () => {
    const { url } = driver
    driver.url = badurl
    const mockCallback = jest.fn(() => {})
    
    await driver.acceptText('AAPL', undefined, 20, mockCallback)
    expect(mockCallback.mock.calls[0][0]).toEqual([])
    expect(mockCallback.mock.calls.length).toBe(1)

    driver.url = url
  })

  it('converts symbols from symlookup response to what ChartIQ expects', () => {
    const result = convertAllSymbolsFormat(mockResponse)
    expect(result).toEqual(mockSymbolsFormatted)
  })

  it('calls chart engine add series with correct ticker', () => {
    document.body.innerHTML = `
      <div>
        <cq-item class="preloaded-comparison">
          <span>.DJI</span>
          <span>Dow Jones Industrial Average</span>
          <span>Nasdaq Composite Index</span>
        </cq-item>
        <cq-item class="preloaded-comparison">
          <span>.SPX</span>
          <span>S&P 500 Index</span>
          <span>Index</span>
        </cq-item>
        <cq-item class="preloaded-comparison">
          <span>.IXIC</span>
          <span>Nasdaq Composite Index</span>
          <span>NASDAQ</span>
        </cq-item>
      </div>
    `

    driver.initPreloaded()

    const symbols = document.querySelectorAll('.preloaded-comparison')
    symbols.forEach((symbol, idx) => {
      const ticker = symbol.children[0].innerHTML
      symbol.click()
      expect(mockChartEngine.addSeries.mock.calls.length).toBe(idx + 1)
      expect(mockChartEngine.addSeries.mock.calls[idx][0]).toBe(ticker)
    })
  })
})
