import React from 'react';
import loadable from '@loadable/component';
//import Loadable from 'react-loadable';
import Loading from '../Loading';


let PhoenixChartWrapper = Loading;
if(typeof document != 'undefined') {
  PhoenixChartWrapper = loadable(() => import('./PhoenixChartWrapper'));
}

const Renderer = () => {
  return (
    <PhoenixChartWrapper />
  );
}

export default Renderer;