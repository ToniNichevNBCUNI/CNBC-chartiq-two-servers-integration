import React from 'react';
import Loadable from 'react-loadable';
import Loading from './Loading';

let PhoenixChartWrapper = Loading;
if (typeof document !== 'undefined') {
  PhoenixChartWrapper = Loadable({
    loader: () => import ('./PhoenixChartWrapperContainer'),
    loading: Loading
  });
}

const onChartReady = (chartEngine)=> {
  console.log("CHART READY >>>", chartEngine);
}

const quoteData =  {
  symbol: 'CMCSA'
}

const Renderer = () => (
  <div className="chartiqWrapper">
    <PhoenixChartWrapper quoteData={quoteData} onChartReady={onChartReady()} />
  </div>
);

export default Renderer;
