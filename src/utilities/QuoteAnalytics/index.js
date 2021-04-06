// import BigTimeEventBus from 'utilities/BigTimeEventBus';

const triggerAnalyticsCall = (eventValue) => {
};

const buildAnalyticsCall = (eventData) => {
  let eventValue;

  if (eventData.type) {
    eventValue = `${eventData.type}:${eventData.value}`;
  } else {
    eventValue = eventData.value;
  }
  triggerAnalyticsCall(eventValue);
  return eventValue;
};

const addEventListener = (element, value, type) => {
  element.addEventListener('click', (e) => {
    const analyticsObj = {
      value: value || e.target.textContent
    };

    if (type) {
      analyticsObj.type = type;
      buildAnalyticsCall(analyticsObj);
    } else {
      buildAnalyticsCall(analyticsObj);
    }
    return analyticsObj;
  });
};

const selectElements = (selector, value, type = null) => {
  document.querySelectorAll(selector).forEach((selectorOption) => {
    addEventListener(selectorOption, value, type);
  });
};

const setUpQuoteChartAnalytics = () => {
  // time range
  selectElements('cq-show-range div');
  // time periods
  selectElements('.ciq-period cq-menu-dropdown cq-item', null, 'Tick Bar Selector');
  // compare
  selectElements('.ciq-nav cq-comparison cq-comparison-add', 'compare');
  // download chart
  selectElements('.DownloadChartButton-downloadButton', 'exportpreview');
  // chart display options
  selectElements('.ciq-display cq-item', null, 'Display');
  // chart display options
  selectElements('.ciq-studies cq-item', null, 'Studies');
  // draw icon
  selectElements('.ciq-draw', 'draw');
  // draw tools
  selectElements('cq-drawing-palette .ciq-tool', null, 'Select Tool');
};

const quoteChartAnalyticsObj = {
  setUpQuoteChartAnalytics,
  triggerAnalyticsCall,
  buildAnalyticsCall,
  addEventListener,
  selectElements
};

export default quoteChartAnalyticsObj;
