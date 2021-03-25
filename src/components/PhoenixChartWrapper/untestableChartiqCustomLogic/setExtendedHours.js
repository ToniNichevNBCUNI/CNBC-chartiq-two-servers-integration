import { 
  minInHours,
  firstPreMarketObjectEntry,
  firstPostMarketObjectEntry,
  timeZoneOffsetFromESTToUTC,
} from '../chartConstants';

const setExtendedHours = (initialSymbolData, params = { base: '' }) => {
  const market = stxx.chart.market;
  const currentDate = new Date();
  const timeZoneOffset = currentDate.getTimezoneOffset()/minInHours;
  const baseFromSpan = stxx.currentBase || '';
  const preMarketOpenOffset = market.normalHours[firstPreMarketObjectEntry] ?
    market.normalHours[firstPreMarketObjectEntry].open_parts.hours + timeZoneOffsetFromESTToUTC - timeZoneOffset :
    undefined;
  const postMarketCloseOffset = market.normalHours[firstPostMarketObjectEntry] ?
    market.normalHours[firstPostMarketObjectEntry].close_parts.hours :
    undefined;

  if ((!preMarketOpenOffset || !postMarketCloseOffset ) || initialSymbolData.type !== 'STOCK') {
    return;
  }
  
  if (initialSymbolData.curmktstatus !== 'REG_MKT') {
    if (
      (params.base.includes('day') || baseFromSpan.includes('day')) &&
      market.getNextOpen() > currentDate &&
      market.getNextOpen().getDay() === currentDate.getDay() &&
      preMarketOpenOffset <= currentDate.getHours()
    ) {
      stxx.isPreMarket = true;
      stxx.extendedHours.set(true);
    } else if (
      (params.base.includes('day') || baseFromSpan.includes('day')) &&
      (
        market.getClose() && market.getClose().getDay() === currentDate.getDay() && currentDate.getHours() <= postMarketCloseOffset || 
        market.getNextOpen() > currentDate && preMarketOpenOffset >= currentDate.getHours()
      ) 
    ) {
      stxx.extendedHours.set(true, ['post']);
      stxx.isAfterPostMarket = true;
    } else {
      stxx.extendedHours.set(true);
      stxx.isPreMarket = true;
    }
  } 
};

export default setExtendedHours;
