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


const Renderer = () => (
  <div className="chartiqWrapper">
    <PhoenixChartWrapper/>
  </div>
);

export default Renderer;
