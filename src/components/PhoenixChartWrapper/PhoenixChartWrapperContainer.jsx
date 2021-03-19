import React from "react";
import { CIQ } from "chartiq/js/componentUI";

import { default as AdvancedChart } from "./AdvancedChart/AdvancedChart";
import { getCustomConfig } from "./AdvancedChart/resources";

// Base styles required for all charts
import "./styles/base-imports";

// Custom Chart IQ
import "./CustomChart.css";
import { default as RecentSymbols } from "./RecentSymbols/RecentSymbols";

/**
 * This is an example custom implementation of the AdvancedChart component with added react components.
 *
 * @export
 * @class CustomChart
 * @extends {React.Component}
 */
export default class CustomChart extends React.Component {
	constructor(props) {
		super(props);
		
		let initialCNBCconfig = {
			quotePageSymbol: 'AAPL',
			noHistoryDataList : '',
			noStreamableList: '',
			timeSeriesAppendUrl: '/adjusted/EST5EDT.json',
		}

		this.config = getCustomConfig({ ... props, initialCNBCconfig});

		// optionally store CIQ, stx, uiContext, ... objects in the state for easy access
		/*
		this.state = {
			chart: new CIQ.UI.Chart(),
			stx: null,
			uiContext: null,
			chartInitializedCallback: props.chartInitialized,
			shortcutDialog: false
		};
		*/
	}

	componentDidMount() {}


	postInit({ chartEngine, uiContext }) {
		//window.stxx = chartEngine; // CNBC bad idea but we need to make chart engine global
		
		chartEngine.setChartType("mountain"); // CNBC customization 

		/*
		chartEngine.loadChart(
			'CMCSA'
		);
		*/

		// optionally call parent component post-init function if there is one defined.
		/*
		if (this.props.chartIntialized) {
			this.props.chartIntialized({ chartEngine, uiContext });
		}

		*/


		//this.setState({ stx: chartEngine, uiContext: uiContext });
	}

	render() {

		return (
			<div className="chartWrapper">
				<AdvancedChart
					config={this.config}
					chartInitialized={this.postInit.bind(this)}
					onChartReady={this.props.onChartReady}
				>
					<div className="ciq-nav full-screen-hide">
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

									<cq-menu class="ciq-menu toggle-options collapse">
										<span></span>
										<cq-menu-dropdown>
											<cq-item cq-member="crosshair">
												Hide Heads-Up Display
												<span className="ciq-radio">
													<span></span>
												</span>
											</cq-item>
											<cq-item cq-member="headsUp-static">
												Show Heads-Up Display
												<span className="ciq-radio">
													<span></span>
												</span>
											</cq-item>
										</cq-menu-dropdown>
									</cq-menu>
								</cq-info-toggle-dropdown>

								<cq-info-toggle-dropdown>
									<cq-toggle class="ciq-HU" cq-member="headsUp">
										<span></span>
										<cq-tooltip>Info</cq-tooltip>
									</cq-toggle>

									<cq-menu class="ciq-menu toggle-options collapse tooltip-ui">
										<span></span>
										<cq-menu-dropdown>
											<cq-item cq-member="headsUp-dynamic">
												Show Dynamic Callout
												<span className="ciq-radio">
													<span></span>
												</span>
											</cq-item>
											<cq-item cq-member="headsUp-floating">
												Show Tooltip
												<span className="ciq-radio">
													<span></span>
												</span>
											</cq-item>
										</cq-menu-dropdown>
									</cq-menu>
								</cq-info-toggle-dropdown>

								<cq-toggle
									className="ciq-DT tableview-ui"
									cq-member="tableView"
								>
									<span></span>
									<cq-tooltip>Table View</cq-tooltip>
								</cq-toggle>
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

								<cq-menu class="ciq-menu ciq-views collapse">
									<span>Views</span>
									<cq-menu-dropdown>
										<cq-views></cq-views>
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

								<cq-menu class="ciq-menu stx-markers collapse">
									<span>Events</span>
									<cq-menu-dropdown>
										<cq-heading>Chart Events</cq-heading>
										<cq-item stxtap="Markers.showMarkers('square')">
											Simple Square
											<span className="ciq-radio">
												<span></span>
											</span>
										</cq-item>
										<cq-item stxtap="Markers.showMarkers('circle')">
											Simple Circle
											<span className="ciq-radio">
												<span></span>
											</span>
										</cq-item>
										<cq-item stxtap="Markers.showMarkers('callout')">
											Callouts
											<span className="ciq-radio">
												<span></span>
											</span>
										</cq-item>
										<cq-item
											class="ta_markers-ui"
											stxtap="Markers.showMarkers('trade')"
										>
											Trade
											<span className="ciq-radio">
												<span></span>
											</span>
										</cq-item>
										<cq-item
											class="video_markers-ui"
											stxtap="Markers.showMarkers('video')"
										>
											Video
											<span className="ciq-radio">
												<span></span>
											</span>
										</cq-item>
										<cq-item stxtap="Markers.showMarkers('abstract')">
											Abstract
											<span className="ciq-radio">
												<span></span>
											</span>
										</cq-item>
										<cq-separator></cq-separator>
										<cq-item
											stxtap="Markers.showMarkers()"
											class="ciq-active"
										>
											None
											<span className="ciq-radio">
												<span></span>
											</span>
										</cq-item>
										<div className="timespanevent-ui">
											<cq-separator></cq-separator>
											<cq-heading>Panel Events</cq-heading>
											<cq-item
												class="span-event"
												stxtap="TimeSpanEvent.showMarkers('Order')"
												cq-no-close
											>
												Order
												<span className="ciq-checkbox ciq-active">
													<span></span>
												</span>
											</cq-item>
											<cq-item
												class="span-event"
												stxtap="TimeSpanEvent.showMarkers('CEO')"
												cq-no-close
											>
												CEO
												<span className="ciq-checkbox ciq-active">
													<span></span>
												</span>
											</cq-item>
											<cq-item
												class="span-event"
												stxtap="TimeSpanEvent.showMarkers('News')"
												cq-no-close
											>
												News
												<span className="ciq-checkbox ciq-active">
													<span></span>
												</span>
											</cq-item>
										</div>
									</cq-menu-dropdown>
								</cq-menu>

								<cq-menu class="ciq-menu ciq-preferences collapse">
									<span></span>
									<cq-menu-dropdown>
										<cq-menu-dropdown-section class="chart-preferences">
											<cq-heading>Chart Preferences</cq-heading>
											<cq-menu-container cq-name="menuChartPreferences"></cq-menu-container>
											<cq-separator></cq-separator>
										</cq-menu-dropdown-section>
										<cq-menu-dropdown-section class="y-axis-preferences">
											<cq-heading>Y-Axis Preferences</cq-heading>
											<cq-menu-container cq-name="menuYAxisPreferences"></cq-menu-container>
											<cq-separator></cq-separator>
										</cq-menu-dropdown-section>
										<cq-menu-dropdown-section class="chart-theme">
											<cq-heading>Themes</cq-heading>
											<cq-themes></cq-themes>
											<cq-separator></cq-separator>
										</cq-menu-dropdown-section>
										<cq-menu-dropdown-section class="chart-locale">
											<cq-heading>Locale</cq-heading>
											<cq-item>
												<cq-clickable
													cq-selector="cq-timezone-dialog"
													cq-method="open"
												>
													Change Timezone
												</cq-clickable>
											</cq-item>
											<cq-item stxsetget="Layout.Language()">
												<cq-flag></cq-flag>
												<cq-language-name>Change Language</cq-language-name>
											</cq-item>
										</cq-menu-dropdown-section>
										<cq-menu-dropdown-section className="shortcuts-ui">
											<cq-separator></cq-separator>
											<cq-heading>Shortcuts</cq-heading>
											<cq-item stxtap="Layout.showShortcuts(true)">
												Shortcuts / Hotkeys
											</cq-item>
										</cq-menu-dropdown-section>
										<cq-menu-dropdown-section class="chart-preferences">
											<cq-separator></cq-separator>
											<cq-heading>Preferences</cq-heading>
											<cq-item stxtap="Layout.openPreferences('drawingTools')">
												Drawing Tools
											</cq-item>
										</cq-menu-dropdown-section>
									</cq-menu-dropdown>
								</cq-menu>
							</div>
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

					<div className="ciq-footer full-screen-hide">
						<cq-share-button></cq-share-button>
						<div
							className="shortcuts-ui ciq-shortcut-button"
							stxtap="Layout.showShortcuts()"
							title="Toggle shortcut legend"
						></div>
						<cq-show-range></cq-show-range>
					</div>

					<div className="cq-context-dialog">
						<cq-dialog>
							<cq-drawing-context></cq-drawing-context>
						</cq-dialog>

						<cq-dialog>
							<cq-study-context></cq-study-context>
						</cq-dialog>
					</div>

					<cq-side-panel></cq-side-panel>
				</AdvancedChart>
			</div>
		);
	}
}