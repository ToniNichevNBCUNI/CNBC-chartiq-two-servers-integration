import React from 'react';
import PhoenixChartWrapper from '../PhoenixChartWrapper';
import Loadable from 'react-loadable';

const ChartPage = ({styles}) => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.leftRail}>
          <PhoenixChartWrapper />
        </div>
        <div className={styles.rightRail}>
          <p>right rail</p>
        </div>

    </div>
  );
}

export default ChartPage;