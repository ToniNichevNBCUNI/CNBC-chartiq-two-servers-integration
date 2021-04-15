import React from "react";
import { CIQ } from "chartiq/js/componentUI";

import AdvancedChart from "./AdvancedChart/AdvancedChart";
import { getCustomConfig } from "./AdvancedChart/resources";

// Base styles required for all charts
import './styles/base-imports';

// CNBC customizations
//import { useQueryParamContext } from 'contexts/QueryParamContext';
import quoteChartAnalyticsObj from 'utilities/QuoteAnalytics';

// Custom Chart IQ
import './CustomChart.css';
import './customChartiqStyles/webChartStyles.css';
import ShortcutDialog from './ShortcutDialog/ShortcutDialog';
import RecentSymbols from './RecentSymbols/RecentSymbols';

import setUpChartConfig from './customChartLogic/setupChartConfig';
import getChartInitParams from './customChartLogic/getChartInitParams';
import setupThemeForChart from './customChartLogic/setupThemeForChart';
import updateLastChartTick from './customChartLogic/updateLastChartTick';

//import timeRangeOverride from './untestableChartiqCustomLogic/timeRangeOverride';
import setSpanOverride from './untestableChartiqCustomLogic/setSpanOverride';
import setPeriodicityOverride from './untestableChartiqCustomLogic/setPeriodicityOverride';
import chartXAxisOVerride from './untestableChartiqCustomLogic/chartXAxisOverride';
import setExtendedHours from './untestableChartiqCustomLogic/setExtendedHours';
import keyStrokeOverride from './untestableChartiqCustomLogic/keyStrokeOverride';
import addTimeRangeClasses from './untestableChartiqCustomLogic/addTimeRangeClasses';

import LookupDriver from './lookupDriver';

import {
  noHistoryDataList,
  noStreamableList,
  dayTimeUnit,
  minuteTimeUnit,
} from './chartConstants';

/**
 * CNBC custom implementation of the AdvancedChart component with added react components.
 *
 * @export
 * @class CustomChart
 * @extends {React.Component}
 */
class CustomChartWeb extends React.Component {

  constructor(props) {
    super(props);
    this.store = new CIQ.NameValueStore();
    this.hasInitialized = false;
    this.initialSymbolData;
    this.globalQueryParams;

    this.hasInitialized;
    this.setHasInitialized;

    const {
      quoteData
    } = props;

    if (Array.isArray(quoteData)) {
      this.initialSymbolData = quoteData[0];
    } else {
      this.initialSymbolData = quoteData;
    }

    const initialCNBCconfig = {
      symbol: this.initialSymbolData.symbol,
	  quoteData: this.initialSymbolData,
      noHistoryDataList,
      noStreamableList,
      timeSeriesAppendUrl: '/adjusted/EST5EDT.json',			
    };

    this.config = getCustomConfig({ ...props, initialCNBCconfig });

    this.config.initialSymbol = {
      symbol: this.initialSymbolData.symbol
    };

    this.config.themes.defaultTheme = 'ciq-day';

    setUpChartConfig(this.initialSymbolData, this.config);

    this.state = {
      chart: new CIQ.UI.Chart(),
      stx: null,
      uiContext: null,
      shortcutDialog: false,
      // CNBC
      hasInitialized: false,
      setHasInitialized: false
    };
  }

	/**
	 * Called after chartEngine.loadChart
	 */
	chartInitCallback = () => {
		console.log('herere');
		if (stxx.currentBase !== 'today' && this.initialSymbolData.curmktstatus !== 'REG_MKT') {
			stxx.home({ maintainWhitespace: false });
		}
		quoteChartAnalyticsObj.setUpQuoteChartAnalytics();
		if (noHistoryDataList.indexOf(this.initialSymbolData.symbol.toUpperCase()) !== -1) {
			stxx.allowZoom = false;
			stxx.allowScroll = false;
			document.querySelector('cq-show-range div:first-child').classList.add('chartTimeIntervalSelected');
		} 
	    if (this.initialSymbolData.type === 'STOCK' &&
			this.initialSymbolData.countryCode === 'US' &&
			this.initialSymbolData.subType !== 'Exchange Traded Fund'
		) {
			document.querySelector('cq-show-range div:first-child').classList.add('chartTimeIntervalSelected');
		} else if (this.initialSymbolData.type === 'FUND') {
			document.querySelector('cq-show-range div:nth-child(5)').classList.add('chartTimeIntervalSelected');
		} else {
			document.querySelector('cq-show-range div:nth-child(7)').classList.add('chartTimeIntervalSelected');
		}
		addTimeRangeClasses();
  }

	/**
	 * The former chartInitialized function.
	 * The starting point of the chart customization process
	 * @param { chartEngine, uiContext }  
	 */
	postInit({ chartEngine, uiContext }) {
		console.log('herere')
		window.stxx = chartEngine; // bad idea to make chart engine global object, but we have no time to refactor.
		this.globalQueryParams = chartEngine;

    	chartEngine.setChartType("mountain");

		// setupThemeForChart(this.globalQueryParams); // we don't need this for WEB chart
		chartXAxisOVerride(); // to-fix: throwwing error because stxx.selectedTimeRange is missing 

		
		// initializes chart with symbol of page
		// eslint-disable-next-line no-param-reassign
		chartEngine.chart.symbolObject = this.initialSymbolData;


		// to-fix: meaningless passing of preMarketOpen and preMarketPrevOpen since they are never initialized.			
		// to-do: add timeRangeOverride 
		//timeRangeOverride(chartEngine, this.initialSymbolData, this.preMarketOpen, this.preMarketPrevOpen);
		setPeriodicityOverride();

		setSpanOverride();

		chartEngine.loadChart(
			this.initialSymbolData.symbol,
			getChartInitParams(this.initialSymbolData, chartEngine, this.preMarketOpen, this.preMarketPrevOpen, false),
			this.chartInitCallback
		);
		new CIQ.InactivityTimer({
			stx: chartEngine,
			minutes: 2
		});
		keyStrokeOverride(uiContext);
		// applies cnbc symbol lookup as comparison driver
		uiContext.setLookupDriver(new LookupDriver(chartEngine));

		
		new CIQ.Tooltip({ stx: chartEngine, ohl: true, volume: true, series: true, studies: true });	

		//this.setUpAppChartInit(chartEngine);
		/*
		// ====================================
		// the usual V8 chart setup
		// ====================================
		if (this.props.chartIntialized) {
			this.props.chartIntialized({ chartEngine, uiContext });
		}

		this.updateCustomization(this.config).then(() => {
			this.addPreferencesHelper(uiContext);
			this.drawingToolsInfo = this.getDrawingTools(uiContext);
		});
		// portalizeContextDialogs(container);

		const self = this;
		const isForecasting = (symbol) => /_fcst$/.test(symbol);
		uiContext.stx.addEventListener(
			"symbolChange",
			({ symbol, symbolObject, action }) => {
				if (
					!isForecasting(symbol) &&
					(action === "master" || action === "add-series")
				) {
					self.updateSymbolStore(symbol, symbolObject);
				}
			}
		);
		*/

		this.setState({ stx: chartEngine, uiContext: uiContext });
	}



	render() {

		let shortcutDialog = null;
		if (this.state.shortcutDialog)
			shortcutDialog = (
				<ShortcutDialog
					drawingToolsInfo={this.drawingToolsInfo}
					closeDialog={(event) => {
						this.closeDialog();
					}}
					setDrawingToolShortcuts={(shortcuts) => {
						this.setDrawingToolShortcuts(shortcuts);
					}}
				></ShortcutDialog>
			);

		return (
			<div className="chartWrapper">
				<AdvancedChart config={this.config} chartInitialized={this.postInit.bind(this)} onChartReady={this.props.onChartReady}>
					<div className="ciq-nav full-screen-hide">
						<div className="ciq-nav">
							<cq-show-range />
							<button className="advanced-chart" onClick={ () => { this.expandChart() } } className={this.expanded ? 'basic-chart' : 'advanced-chart' }>
								<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzMiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMyAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjU1MSAwLjM5NDE5OEMzMi4yNzA0IDAuMTEyNjI4IDMxLjkzMzcgMCAzMS41OTY5IDBIMjJDMjEuNjA3MSAwIDIxLjMyNjUgMC4xMTI2MjggMjEuMDQ1OSAwLjM5NDE5OEMyMC43NjUzIDAuNjc1NzY4IDIwLjY1MzEgMS4wMTM2NSAyMC42NTMxIDEuMzUxNTRDMjAuNjUzMSAxLjc0NTczIDIwLjc2NTMgMi4wMjczIDIxLjA0NTkgMi4zMDg4N0wyNC4xMzI3IDUuNDA2MTRMMTYuNSAxMy4wNjQ4TDE3LjAwNTEgMTMuNTcxN0wxOS40NzQ1IDE2LjA0OTVMMTkuOTc5NiAxNi41NTYzTDI3LjYxMjIgOC44OTc2MUwzMC42OTkgMTEuOTk0OUMzMC45Nzk2IDEyLjI3NjUgMzEuMzE2MyAxMi4zODkxIDMxLjY1MzEgMTIuMzg5MUMzMi4wNDU5IDEyLjM4OTEgMzIuMzI2NSAxMi4yNzY1IDMyLjYwNzEgMTEuOTk0OUMzMi44ODc4IDExLjcxMzMgMzMgMTEuMzc1NCAzMyAxMS4wMzc1VjEuNDA3ODVDMzIuOTQzOSAwLjk1NzMzOCAzMi43NzU1IDAuNjE5NDU0IDMyLjU1MSAwLjM5NDE5OFoiIGZpbGw9IiM3NDc0NzQiLz4KPHBhdGggZD0iTTEzLjUyNTUgMTcuMDA2OEwxMy4wMjA0IDE2LjVMNS4zODc3NiAyNC4xNTg3TDIuMzAxMDIgMjEuMDYxNEMyLjAyMDQxIDIwLjc3OTkgMS42ODM2NyAyMC42NjcyIDEuMzQ2OTQgMjAuNjY3MkMwLjk1NDA4MiAyMC42NjcyIDAuNjczNDY5IDIwLjc3OTkgMC4zOTI4NTcgMjEuMDYxNEMwLjExMjI0NSAyMS4zNDMgMCAyMS42ODA5IDAgMjIuMDE4OFYzMS42NDg1QzAgMzIuMDQyNyAwLjExMjI0NSAzMi4zMjQyIDAuMzkyODU3IDMyLjYwNThDMC42NzM0NjkgMzIuODg3NCAxLjAxMDIgMzMgMS4zNDY5NCAzM0gxMC45NDM5QzExLjMzNjcgMzMgMTEuNjE3MyAzMi44ODc0IDExLjg5OCAzMi42MDU4QzEyLjE3ODYgMzIuMzI0MiAxMi4yOTA4IDMxLjk4NjQgMTIuMjkwOCAzMS42NDg1QzEyLjI5MDggMzEuMzEwNiAxMi4xNzg2IDMwLjk3MjcgMTEuODk4IDMwLjY5MTFMOC44MTEyMiAyNy41OTM5TDE1LjkzODggMjAuNDQyTDE2LjQ0MzkgMTkuOTM1MkwxNS45Mzg4IDE5LjQyODNMMTMuNTI1NSAxNy4wMDY4WiIgZmlsbD0iIzc0NzQ3NCIvPgo8L3N2Zz4K" />
							</button>							
						</div>

						<div className="chartToolsWrapper">				
							<cq-comparison-lookup></cq-comparison-lookup>							

							<cq-side-nav cq-on="sidenavOn">
								<div className="icon-toggles ciq-toggles">
									<cq-toggle class="ciq-draw" cq-member="drawing">
										<span></span>
										<cq-tooltip>Draw</cq-tooltip>
									</cq-toggle>
									<cq-info-toggle-dropdown>
										<cq-toggle class="ciq-CH" cq-member="crosshair">
											<span></span>
											<cq-tooltip>Crosshair (Alt + \)</cq-tooltip>
										</cq-toggle>

									</cq-info-toggle-dropdown>

									<cq-info-toggle-dropdown>
										<cq-toggle class="ciq-HU" cq-member="headsUp">
											<span></span>
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
											<cq-menu-container cq-name="menuPeriodicity"></cq-menu-container>
										</cq-menu-dropdown>
									</cq-menu>

									<cq-menu class="ciq-menu ciq-display collapse">
										<span>Display</span>
										<cq-menu-dropdown>
											<cq-menu-dropdown-section class="chart-types">
												<cq-heading>Chart Style</cq-heading>
												<cq-menu-container cq-name="menuChartStyle"></cq-menu-container>
											</cq-menu-dropdown-section>
											<cq-menu-dropdown-section class="chart-aggregations">
												<cq-menu-container cq-name="menuChartAggregates"></cq-menu-container>
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
																<cq-label class="click-to-edit"></cq-label>
																<div className="ciq-icon ciq-close"></div>
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
												<cq-scriptiq-menu></cq-scriptiq-menu>
												<cq-separator></cq-separator>
											</div>
											<cq-heading cq-filter cq-filter-min="-1">
												Studies
											</cq-heading>
											<cq-studies></cq-studies>
										</cq-menu-dropdown>
									</cq-menu>								
								</div>

							</div>

							
						</div>						
					</div>



					<RecentSymbols
						connectCount="2"
						getRecentSymbols={() => this.getRecentSymbols()}
					>
						<div className="ciq-chart-area">
							<div className="ciq-chart">
								<cq-message-toaster
									defaultDisplayTime="10"
									defaultTransition="slide"
									defaultPosition="top"
								></cq-message-toaster>
								<cq-palette-dock>
									<div className="palette-dock-container">
										<cq-drawing-palette
											class="palette-drawing grid palette-hide"
											docked="true"
											orientation="vertical"
											min-height="300"
											cq-drawing-edit="none"
										></cq-drawing-palette>
										<cq-drawing-settings
											class="palette-settings"
											docked="true"
											hide="true"
											orientation="horizontal"
											min-height="40"
											cq-drawing-edit="none"
										></cq-drawing-settings>
									</div>
								</cq-palette-dock>

								<div className="chartContainer">
									<stx-hu-tooltip>
										<stx-hu-tooltip-field field="DT">
											<stx-hu-tooltip-field-name>
												Date/Time
											</stx-hu-tooltip-field-name>
											<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
										</stx-hu-tooltip-field>
										<stx-hu-tooltip-field field="Close">
											<stx-hu-tooltip-field-name></stx-hu-tooltip-field-name>
											<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
										</stx-hu-tooltip-field>
									</stx-hu-tooltip>

									<cq-chart-title cq-marker cq-browser-tab></cq-chart-title>

									<cq-chartcontrol-group
										class="full-screen-show"
										cq-marker
									></cq-chartcontrol-group>

									<cq-chart-legend></cq-chart-legend>

									<cq-loader></cq-loader>
								</div>
							</div>
						</div>
					</RecentSymbols>

					<cq-abstract-marker cq-type="helicopter"></cq-abstract-marker>

					<cq-attribution></cq-attribution>

					<div className="cq-context-dialog">
						<cq-dialog>
							<cq-drawing-context></cq-drawing-context>
						</cq-dialog>

						<cq-dialog>
							<cq-study-context></cq-study-context>
						</cq-dialog>
					</div>

				</AdvancedChart>
			</div>
		);
	}
}

export default CustomChartWeb;