import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.scss';
import downloadButtonImage from './quotePageDownload.svg';
import chartUtils from './chartUtils';
import cnbcLogo from './CNBC_logo_grey.png';
import cnbcLogoTransparent from './cnbc-logo-transp-for-light-bg.png';

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

let popupCreated = false;

var symbolInfo = {
  symbol: 'AAPL'
}

var export_file_name = symbolInfo.symbol + '_chart.jpeg';

var dest_ctx;

var interval = null;
var drawTextMode = 0
var draw = {
    mode: 0,
    x: 0,
    y: 0
}



const modal = document.createElement('span');
document.body.prepend(modal);

const generateChartShareImage = () => {
  var isRetina = window.devicePixelRatio > 1 ? true : false;

  var chart_canvas = document.querySelector('div.ciq-chart-area > div:nth-child(1) > chartiq-chart-container > canvas:nth-child(19)');
  var dest_canvas = document.getElementById('shareChartContainerCanvas');

  if (chart_canvas.getContext) {
    var dest_ctx = dest_canvas.getContext("2d");
    dest_ctx.fillStyle = "red";
    var width = isRetina ? chart_canvas.width/2 : chart_canvas.width;
    var height = isRetina ? chart_canvas.height/2 : chart_canvas.height;
    // clear drawing area    
    dest_ctx.fillRect(0, 0, width, height + 100);
    // draw the chart
    dest_ctx.drawImage(chart_canvas, 0, 100, width, height);

    // load the logo
    var img = new Image();
    //img.setAttribute('crossOrigin', 'anonymous');
    img.src = cnbcLogo;
    img.onload = function() {
      dest_ctx.drawImage(img, 350,295);
      dest_ctx.fillStyle = "black";

      // add quote data details
      /*
      dest_ctx.font="21px Arial";
      dest_ctx.fillText(symbolInfo.onAirName, 0, 20);

      dest_ctx.font="12px Arial";
      dest_ctx.fillStyle = "#737373";
      var txt = "Real Time Quote " + $('.sub-header span')[1].innerHTML + $('.sub-header span')[2].innerHTML
      dest_ctx.fillText(txt, 0, 35);

      txt = $('.last_time.table-row-group td span')[0].innerHTML + ' | ' + $('.last_time.table-row-group td span')[2].innerHTML
      dest_ctx.fillText(txt, 0, 50);

      dest_ctx.fillStyle = "black";
      dest_ctx.font="20px Arial";
      txt = symbolInfo.last + ' ' + symbolInfo.currencyCode;
      dest_ctx.fillText(txt, 0, 70);

      // add custom text labels
      dest_ctx.font="16px Arial";
      txt = $('#share_chart_text').val()
      dest_ctx.fillText(txt,0, 90);
      */

      //var myImage = dest_canvas.toDataURL("image/png");
      //document.getElementById("shareChartContainerImage").src = myImage

      /*
      var imageCanvas = $('#share-quote-pop #shareChartContainerCanvas')[0]
      var dataURL = dest_canvas.toDataURL('image/jpeg', 1);
      button.href = dataURL;
      */

      // attach export image action
      /*
      var button = $('#share-quote-pop #download-chart-image')[0];
      button.addEventListener('click', function(e) {
          customMessageTextEdited()
          var imageCanvas = $('#share-quote-pop #shareChartContainerCanvas')[0]
          var dataURL = imageCanvas.toDataURL('image/jpeg', 1);
          button.href = dataURL;
          $('.pico-content.quotes-moodle').remove();
          $('.pico-overlay').css('display', 'none');
      });
      */      
  }
}
}

const closePopup = () => {
  document.querySelector(`.${styles.wrapper}`).style.display = "none";
  document.querySelector(`.${styles.picoOverlay}`).style.display = "none";
}

const attachEvents = () => {
  // attach close button action
  document.querySelector('.ChartSharing-containerFooter--3-Guh > div.ChartSharing-closeIt--u3T_3 > div').addEventListener('click', () => { 
    closePopup();
  });    
  // attach export image action
  var button = document.getElementById('download-chart-image');
  button.addEventListener('click', function(e) {
      // customMessageTextEdited()
      var imageCanvas = document.getElementById('shareChartContainerCanvas');
      var dataURL = imageCanvas.toDataURL('image/jpeg', 1);
      button.href = dataURL;
      closePopup();
  });  
}


const renderModalContent = (props) => {
  if(popupCreated === true) {
    document.querySelector(`.${styles.wrapper}`).style.display = "block";
    document.querySelector(`.${styles.picoOverlay}`).style.display = "block";    
    setTimeout( () => {
      generateChartShareImage();
      attachEvents();
    }, 200 );    
    return;
  }
  popupCreated = true;
  ReactDOM.render(  
    <span>
      <div className={styles.wrapper}>

        <div id="share-quote-pop">
          <span className={styles.personalMesage}>
            <input type="text" id="share_chart_text" className={styles.shareChartText} placeholder="Add your headline (optional)" maxLength="72" />
          </span>          
          <canvas className={styles.invisibleCanvas} id='shareChartContainerHiddenCanvas1'></canvas>
          <canvas className={styles.invisibleCanvas} id='shareChartContainerHiddenCanvas2'></canvas>
          <canvas className={styles.visibleCanvas} width={config.canvas.width} height={config.canvas.height} id='shareChartContainerCanvas'></canvas>                  
        </div>
        <div className={styles.containerFooter}>

          <div className={styles.buttonsContainer}>
            <div className={styles.optionButton}>
              <a href="#" download={export_file_name} className={styles.optinQuotesLaunch} id="download-chart-image">DOWNLOAD</a>
            </div>              
          </div> 

        <div class={styles.closeIt}>
          <div class={styles.picoClose}>×</div>
        </div>

        </div>          
      </div>
      <div className={styles.picoOverlay}></div>
    </span>,
    modal
  );
  setTimeout( () => {
    generateChartShareImage();
    attachEvents();
  }, 200 );
}

/**
 * 
 * @param {*} props 
 */
const chartSharing = (props) => {
  return(
    <div className={styles.downloadButton}>
      <a href='#' onClick={ () => { renderModalContent(props) }}>
        <img src={downloadButtonImage} />
      </a>
    </div>
  );
}

export default chartSharing;
