
import { CIQ } from 'chartiq/js/chartiq';

CIQ.Tooltip=function(tooltipParams){
  var stx=tooltipParams.stx;
  var showOhl=tooltipParams.ohl;
  var showChange=tooltipParams.change;
  var showVolume=tooltipParams.volume;
  var showSeries=tooltipParams.series;
  var showStudies=tooltipParams.studies;
  var showOverBarOnly=tooltipParams.showOverBarOnly;
  var showInterpolation=tooltipParams.interpolation;
  var useDataZone=tooltipParams.useDataZone;

  var node=$(stx.chart.container).find("stx-hu-tooltip")[0];
  if(!node){
    node=$("<stx-hu-tooltip></stx-hu-tooltip>").appendTo($(stx.chart.container))[0];
  }
  CIQ.Marker.Tooltip=function(params){
    if(!this.className) this.className="CIQ.Marker.Tooltip";
    params.label="tooltip";
    CIQ.Marker.call(this, params);
  };

  CIQ.Marker.Tooltip.ciqInheritsFrom(CIQ.Marker,false);

  CIQ.Marker.Tooltip.sameBar=function(bar1, bar2){
    if(!bar1 || !bar2) return false;
    if(+bar1.DT!=+bar2.DT) return false;
    if(bar1.Close!=bar2.Close) return false;
    if(bar1.Open!=bar2.Open) return false;
    if(bar1.Volume!=bar2.Volume) return false;
    return true;
  };

  CIQ.Marker.Tooltip.placementFunction = (params) => {
    const leftOffset = 175;
    const stx = params.stx;
    let topOffset = 63;

    for(let i=0;i<params.arr.length;i++){
      const marker=params.arr[i];
      const bar=stx.barFromPixel(stx.cx);

      if(
        (stx.controls.crossX && stx.controls.crossX.style.display=="none") ||
        (stx.controls.crossY && stx.controls.crossY.style.display=="none") ||
        !(stx.insideChart &&
          stx.layout.crosshair &&
          stx.displayCrosshairs &&
          !stx.overXAxis &&
          !stx.overYAxis &&
          !stx.openDialog &&
          !stx.activeDrawing &&
          !stx.grabbingScreen &&
          stx.chart.dataSegment[bar] != "undefined" &&
          stx.chart.dataSegment[bar] &&
          stx.chart.dataSegment[bar].DT
        )
      ){
        marker.node.style.left="-1000px";
        marker.node.style.right="auto";
        marker.lastBar={};
        return;
      }

      if(CIQ.Marker.Tooltip.sameBar(stx.chart.dataSegment[bar], marker.lastBar) && bar!=stx.chart.dataSegment.length-1) return;

      marker.lastBar=stx.chart.dataSegment[bar];
      const criticalCrosshairXValue = stx.width > 700 ? 1060 : 540
      if (criticalCrosshairXValue > CIQ.ChartEngine.crosshairX) {
        marker.node.style.left="auto";
        marker.node.style.right=Math.round(stx.container.clientWidth-stx.pixelFromBar(bar)-leftOffset)+"px";
      } else{
        marker.node.style.left=Math.round(stx.pixelFromBar(bar)-leftOffset)+"px";
        marker.node.style.right="auto";
      }

      if (CIQ.ChartEngine.crosshairY-stx.top < 100) {
        topOffset = -60;
      }

      marker.node.style.top=Math.round(CIQ.ChartEngine.crosshairY-stx.top-topOffset-parseInt(getComputedStyle(marker.node).height,10)/2)+"px";
    }
    stx.doDisplayCrosshairs();
  };

  function renderFunction(){
    // the tooltip has not been initialized with this chart.
    if(!this.huTooltip) return;

    // crosshairs are not on
    if(
      (stx.controls.crossX && stx.controls.crossX.style.display=="none") ||
      (stx.controls.crossY && stx.controls.crossY.style.display=="none")
    ) return;

    var bar=this.barFromPixel(this.cx), data=this.chart.dataSegment[bar];
    if(!data) {
      this.positionMarkers();
      return;
    }
    if(CIQ.Marker.Tooltip.sameBar(data, this.huTooltip.lastBar) && bar!=this.chart.dataSegment.length-1) return;
    var node=$(this.huTooltip.node);
    node.find("[auto]").remove();
    node.find("stx-hu-tooltip-field-value").html();

    var panel=this.chart.panel;
    var yAxis=panel.yAxis;
    var dupMap={};
    var fields=[];
    fields.push({member:"DT", display:"Date/Time", panel:panel, yAxis:yAxis});
    fields.push({member:"Close", display:"Close", panel:panel, yAxis:yAxis});
    dupMap.DT=dupMap.Close=1;
    if(showChange && CIQ.ChartEngine.isDailyInterval(this.layout.interval)){
      fields.push({member:"Change", display:"Change", panel:panel, yAxis:yAxis});
    }
    if(showOhl) {
      fields.push({member:"Open", display:"Open", panel:panel, yAxis:yAxis});
      fields.push({member:"High", display:"High", panel:panel, yAxis:yAxis});
      fields.push({member:"Low", display:"Low", panel:panel, yAxis:yAxis});
      dupMap.Open=dupMap.High=dupMap.Low=1;
    }
    if(showVolume) {
      fields.push({member:"Volume", display:"Volume", panel:null, yAxis:null});  // null yAxis use raw value
      dupMap.Volume=1;
    }
    if(showSeries){
      var renderers=this.chart.seriesRenderers;
      for(var renderer in renderers) {
        var rendererToDisplay = renderers[renderer];
        if(rendererToDisplay===this.mainSeriesRenderer) continue;
        panel=this.panels[rendererToDisplay.params.panel];
        yAxis=rendererToDisplay.params.yAxis;
        if(!yAxis && rendererToDisplay.params.shareYAxis) yAxis=panel.yAxis;
        for(var id=0;id<rendererToDisplay.seriesParams.length;id++){
          var seriesParams=rendererToDisplay.seriesParams[id];
          // if a series has a symbol and a field then it maybe a object chain
          var sKey = seriesParams.symbol;
          var subField=seriesParams.field;
          if(!sKey) sKey = subField;
          else if (subField && sKey!=subField) sKey=CIQ.createObjectChainNames(sKey,subField)[0];
          var display=seriesParams.display || seriesParams.symbol || seriesParams.field;
          if(sKey && !dupMap[display]){
            fields.push({member:sKey, display:display, panel:panel, yAxis:yAxis, isSeries:true});
            dupMap[display]=1;
          }
        }
      }
    }
    if(showStudies){
      for(var study in this.layout.studies) {
        var sd=this.layout.studies[study];
        panel=this.panels[sd.panel];
        yAxis = panel && sd.getYAxis(this);
        for(var output in this.layout.studies[study].outputMap) {
          if(output && !dupMap[output]) {
            fields.push({member:output, display:output, panel:panel, yAxis:yAxis});
            dupMap[output]=1;
          }
        }
        if(!dupMap[study+"_hist"]){
          fields.push({member:study+"_hist", display:study+"_hist", panel:panel, yAxis:yAxis});
          fields.push({member:study+"_hist1", display:study+"_hist1", panel:panel, yAxis:yAxis});
          fields.push({member:study+"_hist2", display:study+"_hist2", panel:panel, yAxis:yAxis});
          dupMap[study+"_hist"]=1;
        }
      }
    }
    for(var f=0;f<fields.length;f++){
      var obj=fields[f];
      var name = obj.member;
      var displayName = obj.display;
      var isRecordDate=(name=="DT");
      if(isRecordDate && !useDataZone && !CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) name="displayDate"; // display date is timezone adjusted
      panel = obj.panel;
      yAxis = obj.yAxis;
      var labelDecimalPlaces=null;
      if(yAxis){
        if(!panel || panel!==panel.chart.panel){
          // If a study panel, use yAxis settings to determine decimal places
          if(yAxis.decimalPlaces || yAxis.decimalPlaces===0) labelDecimalPlaces=yAxis.decimalPlaces;
          else if(yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces===0) labelDecimalPlaces=yAxis.maxDecimalPlaces;
        }else{
          // If a chart panel, then always display at least the number of decimal places as calculated by masterData (panel.chart.decimalPlaces)
          // but if we are zoomed to high granularity then expand all the way out to the y-axis significant digits (panel.yAxis.printDecimalPlaces)
          labelDecimalPlaces=Math.max(yAxis.printDecimalPlaces, panel.chart.decimalPlaces);
          //	... and never display more decimal places than the symbol is supposed to be quoting at
          if(yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces===0) labelDecimalPlaces=Math.min(labelDecimalPlaces, yAxis.maxDecimalPlaces);
        }
      }
      var dsField=null;
      // account for object chains
      var tuple=CIQ.existsInObjectChain(data,name);
      if(tuple) dsField=tuple.obj[tuple.member];
      else if(name=="Change") dsField=data.Close-data.iqPrevClose;

      var fieldName=displayName.replace(/^(Result )(.*)/,"$2");

      if(showInterpolation && fields[f].isSeries && (dsField === null || typeof(dsField)=="undefined")) { // do this only for additional series and not the main series
        var seriesPrice = this.valueFromInterpolation(bar, fieldName, "Close", panel, yAxis);
        if(seriesPrice === null) break;
        dsField = seriesPrice;
      }
      if((dsField || dsField===0) &&
        (isRecordDate || typeof dsField!=="object" || dsField.Close || dsField.Close===0)
      ){
        var fieldValue="";
        if(dsField.Close || dsField.Close===0) dsField=dsField.Close;
        if(dsField.constructor==Number){
          if(!yAxis){  // raw value
            fieldValue=dsField;
          }else if(yAxis.originalPriceFormatter && yAxis.originalPriceFormatter.func){ // in comparison mode with custom formatter
            fieldValue=yAxis.originalPriceFormatter.func(this, panel, dsField, labelDecimalPlaces);
          }else if(yAxis.priceFormatter && yAxis.priceFormatter!=CIQ.Comparison.priceFormat){  // using custom formatter
            fieldValue=yAxis.priceFormatter(this, panel, dsField, labelDecimalPlaces);
          }else{
            fieldValue=this.formatYAxisPrice(dsField, panel, labelDecimalPlaces, yAxis);
          }
        }else if(dsField.constructor==Date){
          if( isRecordDate && this.controls.floatDate && this.controls.floatDate.innerHTML ) {
            if(this.chart.xAxis.noDraw) fieldValue="N/A";
            else fieldValue=CIQ.displayableDate(this,panel.chart,dsField);
          } else {
            fieldValue=CIQ.yyyymmdd(dsField);
            if(!CIQ.ChartEngine.isDailyInterval(this.layout.interval)){
              fieldValue+=" "+dsField.toTimeString().substr(0,8);
            }
          }
        }else{
          fieldValue=dsField;
        }
        var dedicatedField=node.find('stx-hu-tooltip-field[field="'+fieldName+'"]');
        if(dedicatedField.length){
          dedicatedField.find("stx-hu-tooltip-field-value").html(fieldValue);
          var fieldNameField=dedicatedField.find("stx-hu-tooltip-field-name");
          if(fieldNameField.html()==="")
            fieldNameField.html(this.translateIf(fieldName));
        }else{
          $("<stx-hu-tooltip-field auto></stx-hu-tooltip-field>")
            .append($("<stx-hu-tooltip-field-name>"+this.translateIf(fieldName)+"</stx-hu-tooltip-field-name>"))
            .append($("<stx-hu-tooltip-field-value>"+fieldValue+"</stx-hu-tooltip-field-value>"))
            .appendTo(node);
        }
      }else{
        var naField=node.find('stx-hu-tooltip-field[field="'+fieldName+'"]');
        if(naField.length){
          var naFieldNameField=naField.find("stx-hu-tooltip-field-name");
          if(naFieldNameField.html()!=="")
            naField.find("stx-hu-tooltip-field-value").html("n/a");
        }
      }
    }
    this.huTooltip.render();
  }

  CIQ.ChartEngine.prototype.append("undisplayCrosshairs",function(){
    var tt=this.huTooltip;
    if( tt && tt.node ) {
      var node=$(tt.node);
      if( node && node[0]){
        node[0].style.left="-50000px";
        node[0].style.right="auto";
        tt.lastBar={};
      }
    }
  });
  CIQ.ChartEngine.prototype.append("deleteHighlighted",function(){
    this.huTooltip.lastBar={};
    this.headsUpHR();
  });
  CIQ.ChartEngine.prototype.append("headsUpHR", renderFunction);
  CIQ.ChartEngine.prototype.append("createDataSegment", renderFunction);
  stx.huTooltip=new CIQ.Marker.Tooltip({ stx:stx, xPositioner:"bar", chartContainer:true, node:node });
};