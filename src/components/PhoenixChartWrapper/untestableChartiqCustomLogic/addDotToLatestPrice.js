const addDotToLatestPrice = (chartEngine) => {
  let flashingColors=['#0298d3','#19bcfc','#5dcffc','#9ee3ff'];
  let flashingColorIndex=0;
  let flashingColorThrottle=20;
  let flashingColorThrottleCounter=0;    
  let filterSession=false;
  
  chartEngine.append("draw", function() {
    if(filterSession) return;
    if (this.chart.dataSet && this.chart.dataSet.length && this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation ) {
      if(flashingColorThrottleCounter%flashingColorThrottle===0) {
        flashingColorIndex++;
        flashingColorThrottleCounter=0;
      }
      flashingColorThrottleCounter++;
      let context = this.chart.context;
      let panel = this.chart.panel;
      let currentQuote = this.currentQuote();
      if(!currentQuote) return;
      let price = currentQuote.Close;
      let x = this.pixelFromTick(currentQuote.tick, this.chart);
      if( this.chart.lastTickOffset ) x = x + this.chart.lastTickOffset;
      let y = this.pixelFromPrice(price, panel);
      if (this.chart.yAxis.left > x &&
        this.chart.yAxis.top <= y &&
        this.chart.yAxis.bottom >= y) 
      {
        if(flashingColorIndex >= flashingColors.length) flashingColorIndex = 0;
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, 2+flashingColorIndex*1.07, 0, Math.PI * 2, false);
        context.fillStyle = flashingColors[flashingColorIndex];
        context.fill();
      }
    }
  });    
}

export default addDotToLatestPrice;
