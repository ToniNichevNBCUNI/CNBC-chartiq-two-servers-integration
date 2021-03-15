import { CIQ } from 'chartiq/js/chartiq';

const marketFactory = (symbolObject) => {
  const exchangeMap = {}
  exchangeMap['.SPX'] = 'XNYS';
  exchangeMap['.DJI'] = 'XNYS';
  exchangeMap['.IXIC'] = 'XNYS';
  exchangeMap['.FTSE'] = 'LSE';
  exchangeMap['.N225'] = 'XTK1'
  exchangeMap['.VIX'] = '24HR';
  exchangeMap[' VIX'] = '24HR';
  exchangeMap['.HSI'] = 'XHKG';
  exchangeMap['.GDAXI'] = 'FRAB';
  exchangeMap['.SSEC'] = 'SHSC';
  exchangeMap['Euronext Amsterdam'] = 'XAMS'

  const symbol = symbolObject.symbol;
  const splitSymbol = symbol.split('.')[1];
  let market = CIQ.Market.NYSE // default
  
  if (CIQ.Market[symbol]) {
    market = CIQ.Market[symbol];
  }
  if (splitSymbol && CIQ.Market[splitSymbol]) {
    market = CIQ.Market[splitSymbol];
  }
  if (exchangeMap[symbolObject.exchange]) {
    const map = exchangeMap[symbolObject.exchange]
    market = CIQ.Market[map]
  }
  // if (CIQ.Market.Symbology.isForeignSymbol(symbol))  market =  null; // 24 hour market definition
  else if (CIQ.Market.Symbology.isFuturesSymbol(symbol)) {
    market = CIQ.Market.GLOBEX;
  } else if (CIQ.Market.Symbology.isForexMetal(symbol)) {
    market = CIQ.Market.METALS;
  } else if (
    symbolObject.type === 'FOREX' || 
    symbolObject.type === 'CURRENCY' || 
    symbolObject.type === 'DERIVATIVE' || 
    symbolObject.type === 'INDEX' && symbolObject.subType === 'CNBC Synthetic'
  ) {
    market = CIQ.Market.HR24;
  } else if (symbolObject.exchange === 'London Stock Exchange' || symbolObject.exchange === 'FTSE International') {
    market = CIQ.Market.LSE
  } else if (symbolObject.exchange === 'Athens Stock Exchange') {
    market = CIQ.Market.XATH
  } else if (symbolObject.timeZone === 'CEST') {
    market = CIQ.Market.XBRU
  } else if (symbolObject.timeZone === 'CTT') {
    market = CIQ.Market.XHKG
  } else if (symbolObject.timeZone === 'JST') {
    market = CIQ.Market.XTKS
  } else if (symbolObject.timeZone === 'IST') {
    market = CIQ.Market.XNSE
  } else if (symbolObject.timeZone === 'VST') {
    market = CIQ.Market.XSET
  }

  // this.setTimeZone(market.market_tz);
  // stxx.setTimeZone(null, market.market_tz)
  return market;
};

export default marketFactory;
