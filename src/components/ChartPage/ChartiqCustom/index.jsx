import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../Loading';

let ChartiqCustom = Loading;
if (typeof document !== 'undefined') {
  ChartiqCustom = Loadable({
    loader: () => import ('./ChartiqCustom'),
    loading: Loading
  });
}

const Renderer = () => (
  <div className="chartiqWrapper">
    <ChartiqCustom />
  </div>
);

export default Renderer;
