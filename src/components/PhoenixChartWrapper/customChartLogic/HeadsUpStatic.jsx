import React from 'react';

/**
 * Static Heads Up component `<HeadsUpStatic/>`
 *
 * UI widget to display detailed chart data, in a fixed position, corresponding to the mouse pointer as it passes over the chart.
 *
 * @export
 * @class HeadsUpStatic
 * @extends {React.Component}
 */
export default class HeadsUpStatic extends React.Component {
	
	constructor() {
		super();
		this.node = React.createRef();
		this.prevVal = false;
	}

	render() {
		return (
			<cq-hu-static marker="true" ref={this.node}>
				TEST 124
			</cq-hu-static>
		);
	}
}

