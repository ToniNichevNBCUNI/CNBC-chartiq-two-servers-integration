import React from 'react';
import styles from './styles.scss';

const TAB_FILTER = {
  PROFILE: ['US Stock', 'International Stock', 'ETF', 'Fund', 'Index'],
  EARNINGS: ['US Stock', 'ETFd'],
  PEERS: ['US Stock'],
  FINANCIALS: ['US Stock'],
  OPTIONS: ['US Stock'],
  OWNERSHIP: ['US Stock']
}

const quoteClass = 'ETF';

const Renderer = ({title}) => {
  const names = typeof window == 'undefined' ? 'no data on server side' : __API_DATA__.ITVQuoteResult.ITVQuote.symbol;
  return (
    <div className={styles.wrapper}>
      {TAB_FILTER.PROFILE.includes(quoteClass) &&
        <div className={styles.leftRail}>
          <div className={styles.title}>{title}</div>
            <p>{names}</p>
        </div>
      }

        {TAB_FILTER.EARNINGS.includes(quoteClass) &&
        <div className={styles.rightRail}>
          <p>right rai1111l</p>
        </div>
        }
    </div>
  );
}

export default Renderer;