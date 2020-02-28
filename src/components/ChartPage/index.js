import React from 'react';
import PhoenixChartWrapper from '../PhoenixChartWrapper';
import styles from './styles.scss';

const ChartPage = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.leftRail}>
          <div className={styles.title}>Chart</div>
          <PhoenixChartWrapper />
        </div>
        <div className={styles.rightRail}>
          <p>right rail</p>
        </div>

    </div>
  );
}

export default ChartPage;