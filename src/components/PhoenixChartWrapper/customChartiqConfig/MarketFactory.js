const marketFactory =  (symbolObject) => {

  const exchangeMap = []
  exchangeMap['.SPX'] = 'XNYS';
  exchangeMap['.DJI'] = 'XNYS';
  exchangeMap['.IXIC'] = 'XNYS';
  exchangeMap['.FTSE'] = 'XLON';
  exchangeMap['.N225'] = 'XTK1'
  exchangeMap['.VIX'] = '24HR';
  exchangeMap.VIX = '24HR';
  exchangeMap['.HSI'] = 'XHKG';
  exchangeMap['.GDAXI'] = 'FRAB';
  exchangeMap['.SSEC'] = 'SHSC';
  exchangeMap['Euronext Amsterdam'] = 'XAMS'

  const symbol = symbolObject.symbol;
  const splitSymbol = symbol.split('.')[1];
  let market = CIQ.Market.NYSE // default

  if (CIQ.Market[symbol])  {
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
  } else if (symbolInfo.assetSubType == 'FOREX' || symbolInfo.type == 'CURRENCY' || symbolInfo.type == 'DERIVATIVE' || symbolInfo.symbol == 'ETH=' || symbolInfo.type == 'INDEX' && symbolInfo.assetSubType == 'CNBC Synthetic') {
    market = CIQ.Market.HR24;
  } else if (symbolInfo.exchange == 'London Stock Exchange' || symbolInfo.timeZone == 'WEST' || symbolInfo.timeZone  == 'BST') {
    market = CIQ.Market.XLON
  } else if (symbolInfo.exchange == 'Athens Stock Exchange') {
    market = CIQ.Market.XATH
  } else if (symbolInfo.timeZone == 'CEST') {
    market = CIQ.Market.XBRU
  } else if (symbolInfo.timeZone == 'CTT') {
    market = CIQ.Market.XHKG
  } else if (symbolInfo.timeZone == 'JST') {
    market = CIQ.Market.XTKS
  } else if (symbolInfo.timeZone == 'IST') {
    market = CIQ.Market.XNSE
  } else if (symbolInfo.timeZone == 'VST') {
    market = CIQ.Market.XSET
  }

  // this.setTimeZone(market.market_tz);
  stxx.setTimeZone(null, market.market_tz)
  return market;
};

export default marketFactory;
    
