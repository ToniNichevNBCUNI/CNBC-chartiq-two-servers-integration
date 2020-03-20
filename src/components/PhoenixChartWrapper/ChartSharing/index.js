import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.scss';
import image from './quotePageDownload.svg';

var config = {
  "canvas": {
      "width": 670,
      "height": 450,
      "bold_text": '26px "Proxima Nova Semi Bold"',
      "regular_text": '12px "Proxima Nova Semi Bold"',
      "title_text":'20px "Proxima Nova Semi Bold"',
      "title_text_small":'18px "Proxima Nova Semi Bold"',
      "user_text" : '24px "Proxima Nova Semi Bold"',
      "change_text" : '14px "Proxima Nova Semi Bold"',
      "time_range" : '16px "Proxima Nova Semi Bold"'
  },
  textPosition: {
      x: 15,
      y: 29
  }
}

// var export_file_name = symbolInfo.symbol + '_chart.jpeg';

var dest_ctx;

var interval = null;
var drawTextMode = 0
var draw = {
    mode: 0,
    x: 0,
    y: 0
}

const modal = document.createElement('span');
//append that shit
document.body.prepend(modal);

const renderModalContent = (props) => {
    ReactDOM.render(  
      <span>
        <div className={styles.wrapper}>

          <div id="share-quote-pop">
            <span className={styles.personalMesage}>
              <input type="text" id="share_chart_text" className={styles.shareChartText} placeholder="Add your headline (optional)" maxlength="72" />
            </span>          
            <canvas className={styles.invisibleCanvas} id='shareChartContainerHiddenCanvas1'></canvas>
            <canvas className={styles.invisibleCanvas} id='shareChartContainerHiddenCanvas2'></canvas>
            <canvas className={styles.visibleCanvas} width={config.canvas.width} height={config.canvas.height} id='shareChartContainerCanvas'></canvas>                  
          </div>
          <div className={styles.containerFooter}>

            <div className={styles.buttonsContainer}>
              <div className={styles.optionButton}>
                <a href="#" download="file_name" className={styles.optinQuotesLaunch} id="download-chart-image">DOWNLOAD</a>
              </div>              
            </div>                        

          </div>          
        </div>
        <div className={styles.picoOverlay}></div>
      </span>,
      modal
    );
}

const chartSharing = (props) => {
  // renderModalContent(props);
  return(
    <div className={styles.downloadButton}>
      <a href='#' onClick={ () => { renderModalContent(props) }}>
        <img src={image} />
      </a>
    </div>
  );
}

export default chartSharing;
