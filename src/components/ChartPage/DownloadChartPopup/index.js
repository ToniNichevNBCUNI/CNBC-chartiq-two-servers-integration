import React, {useEffect} from 'react';
import styles from './styles.scss';
const symbolInfo = typeof window == 'undefined' ? null : window.__API_DATA__.ITVQuoteResult.ITVQuote;
import CnbcLogo from '../../../assets/images/CNBC_logo_grey.png';

if(typeof window !== 'undefined') {
  symbolInfo.ExtendedMktQuote = {
    last: '22.65'
  }
}

const config = {
  "canvas": {
      "width": 670,
      "height": 450,
      "chartVerticalPosition": 100, 
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

const export_file_name = typeof window !== 'undefined' ? symbolInfo.altName + '_chart.jpeg' : null;

let dest_ctx;   

let draw = {
  mode: 0,
  x: 0,
  y: 0
}


const DownloadChart = (props) => {

    useEffect(() => {
        //$('#shareChartContainerCanvas')
        if(typeof window !== 'undefined')
          generateChartShareImage();
          initDrawing();
    });    

    const generateChartShareImage = () => {
      var isRetina = window.devicePixelRatio > 1 ? true : false;

      var chart_canvas = $('.chartContainer canvas')[0]  // $('.chartworks-modcharts-core.modcharts-root canvas')[0]
      var dest_canvas = $('#shareChartContainerCanvas')[0]

      if (chart_canvas.getContext) {
          // get fresh canvas instance since after clopsing the popup canvas is destroyed
          dest_ctx = dest_canvas.getContext("2d");
          var width = isRetina ? chart_canvas.width / 2 : chart_canvas.width;
          var height = isRetina ? chart_canvas.height / 2 : chart_canvas.height;

          // clear drawing area
          dest_ctx.fillStyle = "white";
          dest_ctx.fillRect(0, 0, width, height + 180);

          // draw chart image
          dest_ctx.drawImage(chart_canvas, 0, config.canvas.chartVerticalPosition, width, height);

          var pos = config.textPosition;

          // custom text label
          txt = $('#share_chart_text').val()
          drawText(txt, pos.x, pos.y, 'black', config.canvas.bold_text)

          // quote name
          drawText(symbolInfo.altName, pos.x, pos.y + 52, 'black', config.canvas.bold_text)
          var sourceTxt = symbolInfo.source != null ? ' | ' + symbolInfo.source : ''
          var txt = symbolInfo.realtime_label + sourceTxt
          drawText(txt, pos.x, pos.y + 70);

          var isExtendedHour = false;
          dest_ctx.font = config.canvas.regular_text
          dest_ctx.fillStyle = "#737373";
          if (typeof symbolInfo.last !== 'undefined' && typeof symbolInfo.ExtendedMktQuote.last != 'undefined') {
              isExtendedHour = true;

              // Extended timestamp
              var txt = 'Last' + ' | ' + symbolInfo.ExtendedMktQuote.last_timedate;
              drawText(txt, pos.x, pos.y + 90);

              // Extended hour Price
              dest_ctx.fillStyle = "#E8802A";
              dest_ctx.font = config.canvas.bold_text
              txt = symbolInfo.ExtendedMktQuote.last + ' ' + symbolInfo.currencyCode;
              drawText(txt, pos.x, pos.y + 112, '#E8802A', '20px Arial');

              // Extended hours
              txt = "Extended Hours";
              dest_ctx.fillText(txt, pos.x, pos.y + 34);

              // Division line
              dest_ctx.beginPath()
              dest_ctx.lineWidth = 0.5
              dest_ctx.strokeStyle = '#ddd7d7' 
              dest_ctx.moveTo(pos.x + 120, pos.y + 80)
              dest_ctx.lineTo(pos.x + 120, pos.y + 112)
              dest_ctx.stroke()
          }

          // timestamp
          dest_ctx.fillStyle = "#737373";
          dest_ctx.font = "12px Arial";
          var x = pos.x + (isExtendedHour * 135);
          txt = "Close" + ' | ' + symbolInfo.last_timedate;
          dest_ctx.fillText(txt, x, pos.y + 90);

          // Price
          dest_ctx.fillStyle = "black";
          dest_ctx.font = config.canvas.bold_text
          txt = symbolInfo.last + ' ' + symbolInfo.currencyCode;
          dest_ctx.fillText(txt, x, pos.y + 112)

          // attribution
          /*
          txt = 'chart by';
          var y = pos.y + config.canvas.height - 105
          drawText(txt, pos.x, y, '#737373', '12px Arial')

          txt = 'Chartworks';
          var y = pos.y + config.canvas.height - 105
          drawText(txt, pos.x + 48, y, '#3DA5ED', '12px Arial')
          */

          // CNBC logo

          debugger;
          var img = new Image();
          img.setAttribute('crossOrigin', 'anonymous')
          img.src = CnbcLogo;
          
          img.onload = function() {
              dest_ctx.drawImage(img, pos.x + 100, pos.y + 357);
              dest_ctx.fillStyle = "white";
              dest_canvas.toDataURL("image/png");
              captureGraphState()
          }
      }
    }    


    const drawText = (txt, x, y, color, font) => {
      color = color || "#737373"
      font = font || "12px Arial"

      dest_ctx.fillStyle = color;
      dest_ctx.font = font
      dest_ctx.fillText(txt, x, y);
    }
    
    const captureGraphState = () => {
      var page2 = $('#shareChartContainerHiddenCanvas1')[0].getContext("2d")
      var dest_canvas = $('#shareChartContainerCanvas')[0]
      page2.drawImage(dest_canvas, 0, 0);
    }
    
    const restoreGraphState = () => {
      var page2 = $('#shareChartContainerHiddenCanvas1')[0]
      dest_ctx.drawImage(page2, 0, 0);
    }
    
    const initDrawing = () => {
      captureGraphState();

      $('#shareChartContainerCanvas').mousedown(function() {
          draw.mode = 1
      });

      $('#shareChartContainerCanvas').mouseup(function(e) {
          captureGraphState()
          draw.mode = 0
      });

      $('#shareChartContainerCanvas').mousemove(function(e) {
          drawAnnotations(e, false)
      })

      function drawAnnotations(e, captureAnnotations) {
          var page2 = $('#shareChartContainerHiddenCanvas1')[0]
          dest_ctx.drawImage(page2, 0, 0)

          var destination_ctx = dest_ctx

          if (draw.mode == 1) {
              draw.x = getMouseCoordinates(e).x
              draw.y = getMouseCoordinates(e).y

              draw.mode = 2;
          } else if (draw.mode == 2) {
              var x = getMouseCoordinates(e).x
              var y = getMouseCoordinates(e).y
              destination_ctx.fillStyle = "black";
              destination_ctx.beginPath();
              destination_ctx.moveTo(draw.x, draw.y);
              destination_ctx.lineTo(x, y);

              drawArow(destination_ctx, draw.x, draw.y, x, y, 2, 15, 8, '#3DA5ED', null);
          }
      }

      function getMouseCoordinates(e) {
          const container = $('#shareChartContainerCanvas').offset()
          const x = e.pageX - container.left
          const y = e.pageY - container.top
          return {
              "x": x,
              "y": y
          }
      }

      // Drawing Helper methods
      function drawArow(ctx, x1, y1, x2, y2, lineWidth, arrowDiamer, arowAngle, color, fillColor) {
          var angle = Math.PI / arowAngle

          var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
          var ratio = (dist - arrowDiamer) / dist;
          var ratio2 = (dist - arrowDiamer / 3) / dist;
          var tox, toy, fromx, fromy;

          fromx = x1 + (x2 - x1) * (1 - ratio2);
          fromy = y1 + (y2 - y1) * (1 - ratio2);

          tox = Math.round(x1 + (x2 - x1) * ratio);
          toy = Math.round(y1 + (y2 - y1) * ratio);

          ctx.beginPath();
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = color;
          ctx.moveTo(fromx, fromy);
          ctx.lineTo(tox, toy);
          ctx.stroke();

          // calculate the angle of the line
          var lineangle = Math.atan2(y2 - y1, x2 - x1);
          // h is the line length of a side of the arrow head
          var h = Math.abs(arrowDiamer / Math.cos(angle));

          var angle1 = lineangle + Math.PI + angle;
          var topx = x2 + Math.cos(angle1) * h;
          var topy = y2 + Math.sin(angle1) * h;
          var angle2 = lineangle + Math.PI - angle;
          var botx = x2 + Math.cos(angle2) * h;
          var boty = y2 + Math.sin(angle2) * h;

          ctx.beginPath();
          ctx.moveTo(topx, topy);
          ctx.lineTo(botx, boty);

          ctx.lineTo(x2, y2);
          ctx.lineTo(topx, topy);

          if (fillColor == null) {
              ctx.stroke();

          } else {
              ctx.fillStyle = fillColor;
              ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(x1, y1, 4, 0, 2 * Math.PI)
          ctx.stroke();
      }
    }

    //console.log(">>", CnbcLogo);

    return(
        <div className={styles.wrapper}>
            <div className={styles.downloadChartModal}>
                <span className={styles.personalMesage}>
                    <p>
                      <input className={styles.message} type="text" id="share_chart_text" placeholder="Add your headline (optional)" maxLength="72" />
                    </p>          
                    <p>
                      <canvas id='shareChartContainerHiddenCanvas1' className={styles.hiddenCanvas} width={config.canvas.width} height={config.canvas.height}></canvas>
                      <canvas id='shareChartContainerHiddenCanvas2' className={styles.hiddenCanvas}></canvas>
                    </p>                                  
                    <p>
                      <canvas width={config.canvas.width} className={styles.visibleCanvas} height={config.canvas.height} id="shareChartContainerCanvas"></canvas>
                    </p>
                </span>
                <div className={styles.optionButton}>
                  <a href="#" download="AAPL_chart.jpeg" class="optin-quotes-launch check-it" id="download-chart-image">DOWNLOAD</a>
                </div>                
            </div>            
        </div>
    );
}

export default DownloadChart;