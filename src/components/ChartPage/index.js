import React , {useState} from 'react';
import PhoenixChartWrapper from '../PhoenixChartWrapper';
import DownloadChartPopup from './DownloadChartPopup';
import DownloadChartButton from './DownloadChartButton';
import styles from './styles.scss';




const ChartPage = () => {

  const [downloadImagePopupVisible, setValueOfDownloadImagePopupVisible] = useState(false);

  return (
    <div>
      <div>
        <div id="company-name-header">TITLE</div>
        <DownloadChartButton sendData={ () => { setValueOfDownloadImagePopupVisible(!downloadImagePopupVisible) } } />
      </div>
      <div className={styles.wrapper}>
          <div className={styles.leftRail}>
            <PhoenixChartWrapper />
            <div className={styles.contentAfterchart}>Test 12345 ...</div>
          </div>
          <div className={styles.rightRail}>
            <p>right rail</p>
          </div>
      </div>
      { downloadImagePopupVisible && <DownloadChartPopup /> }
    </div>      
  );
}

export default ChartPage;