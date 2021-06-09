import React from 'react';
import Loadable from 'react-loadable';
import Loading from './Loading';

import {
  noHistoryDataList,
} from './chartConstants';

let PhoenixChartWrapper = Loading;
if (typeof document !== 'undefined') {
  PhoenixChartWrapper = Loadable({
    loader: () => import ('./PhoenixChartWrapperWeb'),
    loading: Loading
  });
}

const onChartReady = ()=> {
  console.log("do other stuff when chart is initialized");
}

const quoteData =  {
  symbol: 'TSLA',
}

const finalProps = {
  appChart: false,
  globalQueryParams: {
  appChart: false
  },
  noHistoryDataList: noHistoryDataList,
  quoteData: {
    DEBTEQTYQ: "52.82%",
    EventData: {
      announce_time: "A",
      is_halted: "N",
      next_earnings_date: "04/27/2021",
      next_earnings_date_today: "N",
      yrhiind: "N",
      yrloind: "N"
    },
    ExtendedMktQuote: {
      change: "-6.13",
      change_pct: "-0.90%",
      changetype: "DOWN",
      last: "677.67",
      last_timedate: "9:30 AM EDT",
      source: "Last NASDAQ LS, VOL From CTA",
      type: "PRE_MKT",
      volume: "358,091",
      volume_alt: "358.1K",
    },
    GROSMGNTTM: "21.02%",
    NETPROFTTM: "2.73%",
    ROETTM: "4.78%",
    TTMEBITD: "4.316B",
    altName: "Tesla",
    altSymbol: "TSLA.O",
    beta: "2.00",
    change: "-9.87",
    change_pct: "-1.44%",
    changetype: "DOWN",
    code: 0,
    countryCode: "US",
    curmktstatus: "REG_MKT",
    currencyCode: "USD",
    eps: "0.62",
    exchange: "NASDAQ",
    feps: "4.19",
    fpe: "160.92",
    high: "680.97",
    issue_id: "24812378",
    issuer_id: "74213",
    last: "673.93",
    last_time: "2021-04-09T12:13:30.952-0400",
    last_timedate: "12:13 PM EDT",
    low: "669.43",
    mktcapView: "638.814B",
    name: "Tesla Inc",
    onAirName: "Tesla",
    open: "677.77",
    pcttendayvol: "0.3578",
    pe: "1,083.83",
    previous_day_closing: "683.80",
    provider: "CNBC QUOTE CACHE",
    realTime: "true",
    revenuettm: "31.536B",
    sharesout: "947.90M",
    shortName: "TSLA",
    source: "Last NASDAQ LS, VOL From CTA",
    streamable: "1",
    subType: "Common Stock",
    symbol: "TSLA",
    symbolType: "symbol",
    tendayavgvol: "33.01M",
    timeZone: "EDT",
    type: "STOCK",
    volume: "11,452,627",
    volume_alt: "11.5M",
    yrhidate: "01/25/21",
    yrhiprice: "900.40",
    yrlodate: "04/09/20",
    yrloprice: "111.42",
  }
}

const Renderer = () => (
  <div className="chartiqWebWrapper">
    <PhoenixChartWrapper {...finalProps} />
  </div>
);

export default Renderer;
