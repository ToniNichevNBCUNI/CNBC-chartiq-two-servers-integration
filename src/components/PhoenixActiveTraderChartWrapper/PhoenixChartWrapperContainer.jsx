import React, { useState } from "react";

import { default as ActiveTraderWorkstation } from "./ActiveTraderWorkstation";
//import tfcHtml from "chartiq/plugins/tfc/tfcHtml";

// Base styles required for all charts
import "./styles/base-imports";

import { getCustomConfig } from "./resources"; // ChartIQ library resources
import "./ActiveTraderWorkstation.css";

export default function ({ chartInitialized, config, symbol, chartId }) {
	const [configObj] = useState(config || getCustomConfig({ symbol, chartId }));
	

	return (
		<ActiveTraderWorkstation
			config={configObj}
			chartInitialized={chartInitialized}
		/>
	);
}
