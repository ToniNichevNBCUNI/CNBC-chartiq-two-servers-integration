import React from 'react';
import loadable from '@loadable/component';
//import Loadable from 'react-loadable';
import Loading from '../Loading';


let ChartiqCustom = Loading;
if(typeof document != 'undefined') {
  ChartiqCustom = loadable(() => import('./PhoenixChartWrapper'));
}

const Renderer = () => {
  return (
    <ChartiqCustom />
  );
}

export default Renderer;