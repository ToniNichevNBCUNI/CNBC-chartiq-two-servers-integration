import React from 'react';
import Loadable from 'react-loadable';
import Loading from './Loading';

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

const Renderer = () => (
  <div className="chartiqWebWrapper">
    <PhoenixChartWrapper quoteData={quoteData} onChartReady={onChartReady()} />
  </div>
);

export default Renderer;
