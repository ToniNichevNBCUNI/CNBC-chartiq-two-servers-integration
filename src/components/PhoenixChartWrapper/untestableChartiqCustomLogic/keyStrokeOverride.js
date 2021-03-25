import { CIQ } from 'chartiq'
//chartiq hotkey logic with up and down removed
CIQ.UI.KeystrokeHub.CNBCHotKeys=function(key, hub){
  var stx=hub.context.stx;
  var push=1;
  switch(key){
    case "Home":
      stx.home();
      stx.headsUpHR();
      break;
    case "End":
      stx.chart.scroll=stx.chart.dataSet.length;
      stx.draw();
      stx.headsUpHR();
      break;
    case "ArrowLeft":
    case "Left":
      if(stx.ctrl){
        if(stx.allowZoom) stx.zoomOut();
      }else if(stx.allowScroll){
        push=1;
        if(stx.shift || hub.capsLock) push=Math.max(5,5*(8-Math.round(stx.layout.candleWidth)));
        if(stx.chart.scroll+push>=stx.chart.dataSet.length)
          push=stx.chart.dataSet.length-stx.chart.scroll;
        stx.chart.scroll+=push;
        stx.draw();
        stx.headsUpHR();
      }
      break;
    case "ArrowRight":
    case "Right":
      if(stx.ctrl){
        if(stx.allowZoom) stx.zoomIn();
      }else if(stx.allowScroll){
        push=1;
        if(stx.shift || hub.capsLock) push=Math.max(5,5*(8-Math.round(stx.layout.candleWidth)));
        stx.chart.scroll-=push;
        stx.draw();
        stx.headsUpHR();
      }
      break;
    case "Delete":
    case "Backspace":
    case "Del":
      if(CIQ.ChartEngine.drawingLine){
        stx.undo();
      }else if(stx.anyHighlighted){
        stx.deleteHighlighted();
      }else{
        return false;
      }
      break;
    case "Escape":
    case "Esc":
      if(CIQ.ChartEngine.drawingLine){
        stx.undo();
      }else{
        if(hub.uiManager) hub.uiManager.closeMenu();
      }
      break;
    default:
      return false; // not captured
  }
  return true;
};

const KeyStrokeHubOverride = (UIContext) => {
  new CIQ.UI.KeystrokeHub(document.body, UIContext, {cb:CIQ.UI.KeystrokeHub.CNBCHotKeys});
}

export default KeyStrokeHubOverride;
