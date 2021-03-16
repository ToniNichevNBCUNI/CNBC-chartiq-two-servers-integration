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

const Renderer = () => (
  <div className="chartiqWrapper">
    <PhoenixChartWrapper onChartReady={onChartReady()} />
  </div>
);

export default Renderer;
