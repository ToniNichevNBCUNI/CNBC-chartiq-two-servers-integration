import React from 'react';
import loadable from '@loadable/component';
import Loading from './Loading';
import ErrorBoundary from './ErrorChartBoundary'

let PhoenixChartWrapper = Loading;
if (typeof document !== 'undefined') {
  PhoenixChartWrapper = loadable(() => import ('./PhoenixChartWrapperContainer'), {
    fallback: <Loading />,
  });
}

const Renderer = () => (
  <div className="chartiqWrapper">
    <ErrorBoundary>
      <PhoenixChartWrapper />
    </ErrorBoundary>
  </div>
);

export default Renderer;
