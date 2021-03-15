import React from 'react';

/**
 * Chart symbol comparison component `<ChartComparison>`
 *
 * UI widget to select alternative symbols for comparison. Can be used with any market
 * configured by CIQ.Market or any formula.
 *
 * @export
 * @class ChartComparison
 * @extends {React.Component}
 */
export default class ChartComparison extends React.PureComponent {
  render() {
    return (
      <cq-comparison marker="true">
        <cq-menu className="cq-comparison-new">
          <cq-comparison-add-label>
            <cq-comparison-plus></cq-comparison-plus>
            <span>+ Comparison</span>
          </cq-comparison-add-label>
          <cq-comparison-add>
            <cq-comparison-lookup-frame>
              {/*<template cq-lookup="true">*/}
              <cq-lookup cq-keystroke-claim>
                <cq-lookup-input cq-no-close>
                  <input
                    type="text"
                    cq-focus="here"
                    spellCheck="off"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder="Enter Symbol"
                  />
                  <cq-lookup-icon></cq-lookup-icon>
                </cq-lookup-input>
                <cq-lookup-results>
                  <cq-scroll>
                    <cq-item class="preloaded-comparison">
                      <span>.DJI</span>
                      <span>Dow Jones Industrial Average</span>
                      <span>Nasdaq Composite Index</span>
                    </cq-item>
                    <cq-item class="preloaded-comparison">
                      <span>.SPX</span>
                      <span>S&P 500 Index</span>
                      <span>Index</span>
                    </cq-item>
                    <cq-item class="preloaded-comparison">
                      <span>.IXIC</span>
                      <span>Nasdaq Composite Index</span>
                      <span>NASDAQ</span>
                    </cq-item>
                  </cq-scroll>
                </cq-lookup-results>
              </cq-lookup>
              {/*</template>*/}
            </cq-comparison-lookup-frame>
            <cq-swatch cq-no-close></cq-swatch>
            <span>
              <cq-accept-btn class="stx-btn">ADD</cq-accept-btn>
            </span>
          </cq-comparison-add>
        </cq-menu>
        <cq-comparison-key>
          <template cq-comparison-item="true">
            <cq-comparison-item>
              <cq-comparison-swatch></cq-comparison-swatch>
              <cq-comparison-label>AAPL</cq-comparison-label>
              <cq-comparison-price cq-animate></cq-comparison-price>
              <cq-comparison-loader></cq-comparison-loader>
              <div className="stx-btn-ico ciq-close"></div>
            </cq-comparison-item>
          </template>
        </cq-comparison-key>
      </cq-comparison>
    );
  }
}
