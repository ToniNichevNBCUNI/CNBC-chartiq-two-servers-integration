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

		setupThemeForChart(this.globalQueryParams); // we don't need this for WEB chart
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


	// Update chart configuration with drawing tool shortcuts stored
	// in localStorage
	updateCustomization(config) {
		// currently only tool shortcuts are customized locally
		return this.getValue(this.shortcutStorageName).then((shortcuts) => {
			if (!shortcuts || !Object.keys(shortcuts).length) {
				return;
			}
			config.drawingTools.forEach((item) => {
				item.shortcut = shortcuts[item.tool] || "";
			});
		});
	}

	updateSymbolStore(symbol, { name = "", exchDisp = "" } = {}) {
		return this.getRecentSymbols().then((list) => {
			const count = ((list.symbol && list.symbol.count) || 0) + 1;
			list[symbol] = { symbol, name, exchDisp, count, last: +new Date() };
			return this.updateRecentSymbols(list);
		});
	}

	getRecentSymbols() {
		return this.getValue(this.symbolStorageName);
	}

	updateRecentSymbols(value) {
		return this.setValue(this.symbolStorageName, value);
	}

	// Get a value from localStorage
	getValue(name) {
		return new Promise((resolve, reject) => {
			this.store.get(name, (err, value) => {
				if (err) return reject(err);
				resolve(value || {});
			});
		});
	}
	// Set a value from localStorage
	setValue(name, value) {
		return new Promise((resolve, reject) => {
			this.store.set(name, value, (err) => {
				if (err) return reject(err);
				resolve(value);
			});
		});
	}

	// Injects a helper into the ChartIQ UI Layout object to invoke when
	// the custom added "Drawing Tools" item in the options menu is selected.
	addPreferencesHelper(uiContext) {
		const layoutHelper = uiContext.getAdvertised("Layout");

		layoutHelper.openPreferences = (node, type) => {
			this.setState({ shortcutDialog: true });
		};
	}

	// Retrieve an array of the drawing tools from the ChartIQ config object to
	// pass along to the custom ShortcutDialog component.
	getDrawingTools(uiContext) {
		const { drawingToolDetails: details } = this;

		let drawingTools = this.config.drawingTools.slice();
		return drawingTools.map(({ label, shortcut, tool }) => {
			return {
				label,
				tool,
				shortcut: shortcut || "",
				detail: details[tool]
			};
		});
	}

	// Store shortcut changed from the custom ShortcutDialog component in
	// localStorage
	setDrawingToolShortcuts(shortcuts) {
		const { topNode } = this.state.uiContext;

		this.config.drawingTools.forEach((item) => {
			item.shortcut = shortcuts[item.tool];
		});

		this.setValue(this.shortcutStorageName, shortcuts);

		rebuildDrawingPalette(topNode);
	}

	// Handler to pass along to the custom ShortcutDialog component that sets
	// its closed state
	closeDialog() {
		this.setState({ shortcutDialog: false });
	}

	// Return elements for chart plugin toggle buttons
	getPluginToggles() {
		const { tfc } = this.state.stx || {};
		return (
			<div className="trade-toggles ciq-toggles">
				{tfc && (
					<cq-toggle class="tfc-ui sidebar stx-trade" cq-member="tfc">
						<span></span>
						<cq-tooltip>Trade</cq-tooltip>
					</cq-toggle>
				)}
				<cq-toggle
					class="analystviews-ui stx-analystviews tc-ui stx-tradingcentral"
					cq-member="analystviews"
				>
					<span></span>
					<cq-tooltip>Analyst Views</cq-tooltip>
				</cq-toggle>
				<cq-toggle
					class="technicalinsights-ui stx-technicalinsights recognia-ui stx-recognia"
					cq-member="technicalinsights"
				>
					<span></span>
					<cq-tooltip>Technical Insights</cq-tooltip>
				</cq-toggle>
			</div>
		);
	}

	render() {
		const pluginToggles = this.getPluginToggles();

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
				<AdvancedChart
					config={this.config}
					chartInitialized={this.postInit.bind(this)}
					onChartReady={this.props.onChartReady}
				>
					<div className="ciq-nav full-screen-hide">
            <div>
              <cq-show-range />
            </div>
						<div className="sidenav-toggle ciq-toggles">
							<cq-toggle
								class="ciq-sidenav"
								cq-member="sidenav"
								cq-toggles="sidenavOn,sidenavOff"
								cq-toggle-classes="active,"
							>
								<span></span>
								<cq-tooltip>More</cq-tooltip>
							</cq-toggle>
						</div>

						<cq-menu class="ciq-search">
							<RecentSymbols getRecentSymbols={() => this.getRecentSymbols()}>
								<cq-lookup
									cq-keystroke-claim
									cq-keystroke-default
									cq-uppercase
								></cq-lookup>
							</RecentSymbols>
						</cq-menu>

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

							{pluginToggles}
						</div>
					</div>

					<cq-scriptiq class="scriptiq-ui"></cq-scriptiq>

					<cq-tradingcentral
						class="tc-ui"
						token="eZOrIVNU3KR1f0cf6PTUYg=="
						partner="1000"
						disabled
					></cq-tradingcentral>

					<cq-recognia uid="" lang="en" disabled></cq-recognia>

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

									<cq-comparison-lookup></cq-comparison-lookup>

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

					<cq-side-panel></cq-side-panel>

					{shortcutDialog}
				</AdvancedChart>
			</div>
		);
	}
}

/**
 * For applications that have more then one chart, keep single dialog of the same type
 * and move it outside context node to be shared by all chart components
 */
function portalizeContextDialogs(container) {
	container.querySelectorAll("cq-dialog").forEach((dialog) => {
		dialog.remove();
		if (!dialogPortalized(dialog)) {
			document.body.appendChild(dialog);
		}
	});
}

function dialogPortalized(el) {
	const tag = el.firstChild.nodeName.toLowerCase();
	return Array.from(document.querySelectorAll(tag)).some(
		(el) => !el.closest("cq-context")
	);
}

// Helper function that removes the existing drawing palette component and adds
// a new one.
function rebuildDrawingPalette(el) {
	const qs = (path) => el.querySelector(path);
	const container = qs(".palette-dock-container");
	const palette = qs("cq-drawing-palette");
	const newPalette = document.createElement("cq-drawing-palette");

	newPalette.className = palette.className;
	newPalette.setAttribute("docked", palette.getAttribute("docked"));
	newPalette.setAttribute("orientation", palette.getAttribute("orientation"));
	newPalette.setAttribute("min-height", palette.getAttribute("min-height"));
	const noOp = () => {};
	palette.keyStroke = palette.handleMessage = noOp;
	palette.remove();

	container.appendChild(newPalette);
}

export default CustomChartWeb;