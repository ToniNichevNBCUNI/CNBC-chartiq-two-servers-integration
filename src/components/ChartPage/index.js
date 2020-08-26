import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../Loading';



const chartA = Loadable({
  loader: () => import ('./chartA'),
  loading: Loading
});

const chartB = Loadable({
  loader: () => import ('./chartB'),
  loading: Loading
});

const components = {
  chartA,
  chartB
}

const Home = () => {
  const chartType = process.env.CHART_TYPE;

  const Component = components[chartType];
  return (
      <Component />
  )
}
export default Home;