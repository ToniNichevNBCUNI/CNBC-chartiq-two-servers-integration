import React from 'react';
import ReactDom from 'react-dom';

import { CIQ } from 'chartiq/js/chartiq';
// remove following line for production use
CIQ.debug = true;

import { AdvancedChart } from './chartiq';
// chart style sheets
import './chartiq/styles/base-imports';

// custom css styles following base style sheets
import './custom_chartiq_config/chart_styles.css';

// import custom configuration selector function
import { getConfiguration, pluginsToLoadLazy } from './custom_chartiq_config';

const config = getConfiguration();


/**
 * Optional callback function to access chart engine and uiContext
 */
const chartInitialized = ({ chartEngine, uiContext }) => {
  console.log("@@@@@@@@@@@@@@@");
	// access to chart engine and uiContext
  console.log(chartEngine, uiContext);
  
  var helicopter=$(".stx-marker.abstract").clone();
  helicopter.css({"z-index":"30","left":(0.4*chartEngine.chart.width).toString()+"px"});
  var marker=new CIQ.Marker({
      stx: chartEngine,
      xPositioner:"none",
      yPositioner:"above_candle",
      label: "helicopter",
      permanent: true,
      chartContainer: true,
      node: helicopter[0]
  });
};


const PhoenixChartWrapper = () => {
  return (
    <div> 
        <AdvancedChart
            config={config}
            chartInitialized={chartInitialized}
            pluginsToLoadLazy={pluginsToLoadLazy}
        />  
    </div>
  );
}
 
export default PhoenixChartWrapper;