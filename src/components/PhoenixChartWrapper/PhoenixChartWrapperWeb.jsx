/* eslint-disable no-new */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CIQ } from 'chartiq/js/componentUI';

import quoteChartAnalyticsObj from 'utilities/QuoteAnalytics';

import AdvancedChart from './AdvancedChart/AdvancedChart';
import { getCustomConfig } from './AdvancedChart/resources';

// Base styles required for all charts
import './styles/base-imports';

// Custom Chart IQ
import './CustomChart.css';
import './customChartiqStyles/webChartStyles.css';
import expandArrow from './expandArrows.svg';

// CNBC customizations
import getChartInitParams from './customChartLogic/getChartInitParams';
import updateLastChartTick from './customChartLogic/updateLastChartTick';

import setSpanOverride from './untestableChartiqCustomLogic/setSpanOverride';
import setPeriodicityOverride from './untestableChartiqCustomLogic/setPeriodicityOverride';
import chartXAxisOVerride from './untestableChartiqCustomLogic/chartXAxisOverride';
import addTimeRangeClasses from './untestableChartiqCustomLogic/addTimeRangeClasses';

import ChartComparison from './customChartLogic/chartComparison';

import LookupDriver from './lookupDriver';

import {
  noHistoryDataList,
} from './chartConstants';

/**
 * CNBC custom implementation of the AdvancedChart component with added react components.
 *
 * @export
 * @class CustomChart
 * @extends {React.Component}
 */

let initialSymbolData;
let config;

const CustomChartWeb = (props) => {
  const {
    quoteData
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  if (!config) {
    config = getCustomConfig({ ...props, noHistoryDataList });
  }

  if (Array.isArray(quoteData)) {
    initialSymbolData = quoteData[0];
  } else {
    initialSymbolData = quoteData;
  }

  useEffect(() => {
    if (!stxx) { return; }
    if (!stxx.masterData || !stxx.chart.dataSegment) { return; }

    updateLastChartTick(quoteData);
  }, [quoteData]);
  /**
	 * Called after chartEngine.loadChart
	 */
  const chartInitCallback = () => {
    if (stxx.currentBase !== 'today' && initialSymbolData.curmktstatus !== 'REG_MKT') {
      stxx.home({ maintainWhitespace: false });
    }
    quoteChartAnalyticsObj.setUpQuoteChartAnalytics();
    if (noHistoryDataList.indexOf(initialSymbolData.symbol.toUpperCase()) !== -1) {
      stxx.allowZoom = false;
      stxx.allowScroll = false;
      document.querySelector('cq-show-range div:first-child').classList.add('chartTimeIntervalSelected');
    }
    if (
      initialSymbolData.type === 'STOCK' &&
      initialSymbolData.countryCode === 'US' &&
      initialSymbolData.subType !== 'Exchange Traded Fund'
    ) {
      document.querySelector('cq-show-range div:first-child').classList.add('chartTimeIntervalSelected');
    } else if (initialSymbolData.type === 'FUND') {
      document.querySelector('cq-show-range div:nth-child(5)').classList.add('chartTimeIntervalSelected');
    } else {
      document.querySelector('cq-show-range div:nth-child(7)').classList.add('chartTimeIntervalSelected');
    }
	  addTimeRangeClasses();
  };

  /**
	 * The former chartInitialized function.
	 * The starting point of the chart customization process
	 * @param { chartEngine, uiContext }
	 */
  const postInit = ({ chartEngine, uiContext }) => {
    // applies stxx to global space for useEffect
    window.stxx = chartEngine;

    chartEngine.setChartType('mountain');
    stxx.layout.crosshair = true;
    // eslint-disable-next-line no-param-reassign
    chartEngine.chart.symbolObject = initialSymbolData;

    chartXAxisOVerride();
    setPeriodicityOverride();
    setSpanOverride();

    chartEngine.loadChart(
      initialSymbolData.symbol,
      getChartInitParams(initialSymbolData, chartEngine, false),
      chartInitCallback
    );
    new CIQ.InactivityTimer({
      stx: chartEngine,
      minutes: 2
    });
    // applies cnbc symbol lookup as comparison driver
    uiContext.setLookupDriver(new LookupDriver(chartEngine));

    new CIQ.Tooltip({ stx: chartEngine, ohl: true, volume: true, series: true, studies: true });
  };

  /**
	 * Expand the chart, and hides all other elements, leaving only header and footer
	 */
  const expandChart = () => {
    if (isExpanded) {
      document.querySelector('[class*="QuotePageBuilder-sidebar"]').style.display = 'block';
      document.querySelector('[class*="QuotePageTabs').style.display = 'block';
      document.querySelector('[class*="QuotePageBuilder-mainContent"]').style.minWidth = '';
      document.querySelector('.chartWrapper').style.height = '40vh';
      setIsExpanded(false);
      quoteChartAnalyticsObj.triggerAnalyticsCall('basic');
    } else {
      document.querySelector('[class*="QuotePageBuilder-sidebar"]').style.display = 'none';
      document.querySelector('[class*="QuotePageTabs').style.display = 'none';
      document.querySelector('[class*="QuotePageBuilder-mainContent"]').style.minWidth = '100%';
      document.querySelector('.chartWrapper').style.height = '60vh';
      setIsExpanded(true);
      quoteChartAnalyticsObj.triggerAnalyticsCall('advanced');
    }
  };

  return (
    <div className="chartWrapper">
      <AdvancedChart config={config} chartInitialized={postInit}>
        <div className="ciq-nav full-screen-hide">
          <div className="ciq-nav">
            <cq-show-range />
            <button onClick={() => { expandChart(); }} className={isExpanded ? 'basic-chart' : 'advanced-chart'}>
              <img src={expandArrow} alt={'expanded Arrow button'} />
            </button>
          </div>
          <div className="chartToolsWrapper">
            <ChartComparison />
            <cq-side-nav cq-on="sidenavOn">
              <div className="icon-toggles ciq-toggles">
                <cq-toggle class="ciq-draw" cq-member="drawing">
                  <span />
                  <cq-tooltip>Draw</cq-tooltip>
                </cq-toggle>
                <cq-info-toggle-dropdown>
                  <cq-toggle class="ciq-CH" cq-member="crosshair">
                    <span />
                    <cq-tooltip>Crosshair (Alt + \)</cq-tooltip>
                  </cq-toggle>

                </cq-info-toggle-dropdown>

                <cq-info-toggle-dropdown>
                                    
                  
                  <cq-toggle class="ciq-HU" cq-member="headsUp" cq-toggles="static,null">
                    <span />
                    <cq-tooltip>Info</cq-tooltip>
                  </cq-toggle>


                </cq-info-toggle-dropdown>
              </div>
            </cq-side-nav>
            <div className="ciq-menu-section">
              <div className="ciq-dropdowns">
                <cq-menu class="ciq-menu ciq-period">
                  <span>
                    <cq-clickable stxbind="Layout.periodicity">
                      1D
                    </cq-clickable>
                  </span>
                  <cq-menu-dropdown>
                    <cq-menu-container cq-name="menuPeriodicity" />
                  </cq-menu-dropdown>
                </cq-menu>
                <cq-menu class="ciq-menu ciq-display collapse">
                  <span>Display</span>
                  <cq-menu-dropdown>
                    <cq-menu-dropdown-section class="chart-types">
                      <cq-heading>Chart Style</cq-heading>
                      <cq-menu-container cq-name="menuChartStyle" />
                    </cq-menu-dropdown-section>
                    <cq-menu-dropdown-section class="chart-aggregations">
                      <cq-menu-container cq-name="menuChartAggregates" />
                    </cq-menu-dropdown-section>
                  </cq-menu-dropdown>
                </cq-menu>
                <cq-menu
                  class="ciq-menu ciq-studies collapse"
                  cq-focus="input"
                >
                  <span>Studies</span>
                  <cq-menu-dropdown>
                    <cq-study-legend cq-no-close>
                      <cq-section-dynamic>
                        <cq-heading>Current Studies</cq-heading>
                        <cq-study-legend-content>
                          <template cq-study-legend="true">
                            <cq-item>
                              <cq-label class="click-to-edit" />
                              <div className="ciq-icon ciq-close" />
                            </cq-item>
                          </template>
                        </cq-study-legend-content>
                        <cq-placeholder>
                          <div
                            stxtap="Layout.clearStudies()"
                            className="ciq-btn sm"
                          >
                            Clear All
                          </div>
                        </cq-placeholder>
                      </cq-section-dynamic>
                    </cq-study-legend>
                    <div className="scriptiq-ui">
                      <cq-heading>ScriptIQ</cq-heading>
                      <cq-item>
                        <cq-clickable
                          cq-selector="cq-scriptiq-editor"
                          cq-method="open"
                        >
                          New Script
                        </cq-clickable>
                      </cq-item>
                      <cq-separator />
                    </div>
                    <cq-heading cq-filter cq-filter-min="-1">
                      Studies
                    </cq-heading>
                    <cq-studies />
                  </cq-menu-dropdown>
                </cq-menu>
              </div>
            </div>
          </div>
        </div>
        <div className="ciq-chart-area">
          <div className="ciq-chart">
            <cq-message-toaster
              defaultDisplayTime="10"
              defaultTransition="slide"
              defaultPosition="top"
            />
            <cq-palette-dock>
              <div className="palette-dock-container">
                <cq-drawing-palette
                  class="palette-drawing grid palette-hide"
                  docked="true"
                  orientation="vertical"
                  min-height="300"
                  cq-drawing-edit="none"
                />
                <cq-drawing-settings
                  class="palette-settings"
                  docked="true"
                  hide="true"
                  orientation="horizontal"
                  min-height="40"
                  cq-drawing-edit="none"
                />
              </div>
            </cq-palette-dock>

            <div className="chartContainer">
              <stx-hu-tooltip>
                <stx-hu-tooltip-field field="DT">
                  <stx-hu-tooltip-field-name>
                    Date/Time
                  </stx-hu-tooltip-field-name>
                  <stx-hu-tooltip-field-value />
                </stx-hu-tooltip-field>
                <stx-hu-tooltip-field field="Close">
                  <stx-hu-tooltip-field-name />
                  <stx-hu-tooltip-field-value />
                </stx-hu-tooltip-field>
              </stx-hu-tooltip>

              <cq-chart-title cq-marker cq-browser-tab />
              <cq-chartcontrol-group
                class="full-screen-show"
                cq-marker
              />
              <cq-chart-legend />
              <cq-loader />
            </div>
          </div>
        </div>
        <cq-attribution />
        <div className="cq-context-dialog">
          <cq-dialog>
            <cq-drawing-context />
          </cq-dialog>

          <cq-dialog>
            <cq-study-context />
          </cq-dialog>
        </div>
      </AdvancedChart>
    </div>
  );
};

CustomChartWeb.propTypes = {
  quoteData: PropTypes.object.isRequired,
};

export default CustomChartWeb;
