const SYMLOOKUP_URI = 'https://symlookup.cnbc.com/symlookup.do';

export default class LookupDriver {
  constructor(chartEngine, exchanges) {
    this.exchanges = exchanges || [
      'XNYS',
      'XASE',
      'XNAS',
      'XASX',
      'INDCBSX',
      'INDXASE',
      'INDXNAS',
      'IND_DJI',
      'ARCX',
      'INDARCX',
      'forex'
    ];
    this.url = new URL(SYMLOOKUP_URI);
    this.chartEngine = chartEngine;
    this.initPreloaded();
  }

  async acceptText(text, _, maxResults, cb) {
    const url = this.createRequestURL(text, maxResults || 20)
    const res = await LookupDriver.sendRequest(url)
    if (res.ok) {
      const parsedRes = await LookupDriver.parseResponse(res)
      const symbols = LookupDriver.convertAllSymbolsFormat(parsedRes)
      cb(symbols)
    } else {
      // run callback with empty array to clear the preloaded Symbols from ui
      cb([])
    }

  }

  createRequestURL(text, maxResults) {
    const url = new URL(this.url)
    url.searchParams.append('prefix', text)
    url.searchParams.append('maxresult', maxResults)
    return url
  }

  static async sendRequest(url) {
    const res = await fetch(url, { cache: 'force-cache' })
    return res
  }

  static async parseResponse(req) {
    const parsedResponse = await req.json()
    return parsedResponse
  }

  static convertSymbolFormat(symbol) {
    const { symbolName, companyName, exchangeName, issueType } = symbol
    return ({
      display: [symbolName, companyName, exchangeName],
      data: {
        symbol: symbolName,
        name: companyName,
        exchDisp: exchangeName,
        issueType
      }  
    })
  }

  static convertAllSymbolsFormat(parsedRes) {
    const symbols = parsedRes
    let results = [];
    
    if (symbols.length > 1) {
      results = symbols.slice(1).map(LookupDriver.convertSymbolFormat)
    }

    return results
  }

  initPreloaded() {
    const preloaded = Array.from(document.querySelectorAll('.preloaded-comparison'))
    preloaded.forEach(symbol => {
      const ticker = symbol.children[0].innerHTML
      symbol.addEventListener('click', () => this.chartEngine.addSeries(ticker, { isComparison: true, color: '#FF0000' }))
    })
  }
}

export const sendRequest = LookupDriver.sendRequest
export const convertAllSymbolsFormat = LookupDriver.convertAllSymbolsFormat
