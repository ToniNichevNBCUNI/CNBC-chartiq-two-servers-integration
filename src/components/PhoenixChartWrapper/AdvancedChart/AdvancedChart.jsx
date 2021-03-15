import React from "react";
import { CIQ } from "chartiq/js/componentUI";

// Base styles required by the library to render color correctly.
// If for some reason you are not including base-styles.css add these here.
//import 'chartiq/css/stx-chart.css'; // Chart API
//import 'chartiq/css/chartiq.css'; // Chart UI

/**
 * This is a fully functional example showing how to load a chart with complete user interface.
 *
 * @export
 * @class AdvancedChart
 * @extends {React.Component}
 */
export default class AdvancedChart extends React.Component {
	constructor(props) {
		super(props);
		this.container = React.createRef();

		this.state = {
			chart: new CIQ.UI.Chart(),
			stx: null,
			UIContext: null,
			chartInitializedCallback: props.chartInitialized
		};
	}

	componentDidMount() {
		const container = this.container.current;
		const { chartInitializedCallback } = this.state;
		let { config } = this.props;


		const uiContext = this.createChartAndUI({ container, config });
		const chartEngine = uiContext.stx;

		this.setState({ stx: chartEngine, UIContext: uiContext });

		if (chartInitializedCallback) {
			chartInitializedCallback({ chartEngine, uiContext });
		}

	}

	componentWillUnmount() {
		// Destroy the ChartEngine instance when unloading the component.
		// This will stop internal processes such as quotefeed polling.
		this.state.stx.destroy();
	}

	createChartAndUI({ container, config }) {
		const uiContext = this.state.chart.createChartAndUI({ container, config });
		return uiContext;
	}

	render() {
		return (
			<cq-context ref={this.container}>
				{this.props.children}
			</cq-context>
		);
	}
}