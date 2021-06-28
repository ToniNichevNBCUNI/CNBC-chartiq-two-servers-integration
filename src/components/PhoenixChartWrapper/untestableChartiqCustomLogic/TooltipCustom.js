
import { CIQ } from 'chartiq/js/chartiq';

CIQ.Tooltip = function (tooltipParams) {
  if (!CIQ.Marker) {
    console.warn(
      "CIQ.Tooltip addon requires CIQ.Marker module to be enabled."
    );
    return;
  }

  this.cssRequired = true;

  const {
    stx,
    ohl: showOhl,
    change: showChange,
    volume: showVolume,
    series: showSeries,
    studies: showStudies,
    interpolation: showInterpolation,
    showOverBarOnly,
    showBarHighlight = true,
    useDataZone
  } = tooltipParams;
  const { container } = stx.chart;

  let node = container.querySelector("stx-hu-tooltip");
  if (!node) {
    node = document.createElement("stx-hu-tooltip");
    container.appendChild(node);
  }

  let highlightEl = container.querySelector(".stx-hu-tooltip-highlight");
  if (!highlightEl) {
    highlightEl = document.createElement("div");
    highlightEl.classList.add("stx-hu-tooltip-highlight");
    container.appendChild(highlightEl);
  }

  CIQ.Marker.Tooltip = function (params) {
    if (!this.className) this.className = "CIQ.Marker.Tooltip";
    this.highlightEl = highlightEl;
    params.label = "tooltip";
    CIQ.Marker.call(this, params);
  };

  CIQ.inheritsFrom(CIQ.Marker.Tooltip, CIQ.Marker, false);

  CIQ.Marker.Tooltip.sameBar = function (bar1, bar2) {
    if (!bar1 || !bar2) return false;
    if (+bar1.DT != +bar2.DT) return false;
    if (bar1.Close != bar2.Close) return false;
    if (bar1.Open != bar2.Open) return false;
    if (bar1.Volume != bar2.Volume) return false;
    return true;
  };

  CIQ.Marker.Tooltip.placementFunction = function (params) {
    if (hideIfDisabled()) return;
    const leftOffset = 175;
    let topOffset = 63;
    // var offset = 30;
    var stx = params.stx;
    for (var i = 0; i < params.arr.length; i++) {
      var marker = params.arr[i];
      var bar = stx.barFromPixel(stx.cx);
      var quote = stx.chart.dataSegment[bar];
      var goodBar;
      var overBar = true;
      var highPx, lowPx;

      if (quote != "undefined" && quote && quote.DT) {
        goodBar = true;
        if (quote.High) highPx = stx.pixelFromPrice(quote.High);
        if (quote.Low) lowPx = stx.pixelFromPrice(quote.Low);
        if (!stx.chart.highLowBars) {
          if (quote.Close) {
            highPx = stx.pixelFromPrice(quote.Close) - 15;
            lowPx = stx.pixelFromPrice(quote.Close) + 15;
          }
        }
        if (showOverBarOnly && !(stx.cy >= highPx && stx.cy <= lowPx))
          overBar = false;
      }

      if (
        !(
          stx.insideChart &&
          !stx.openDialog &&
          !stx.activeDrawing &&
          !stx.grabbingScreen &&
          goodBar &&
          overBar
        )
      ) {
        highlightEl.style.display = "none";
        marker.node.style.left = "-50000px";
        marker.node.style.right = "auto";
        marker.lastBar = {};
        return;
      }
      if (
        CIQ.Marker.Tooltip.sameBar(
          stx.chart.dataSegment[bar],
          marker.lastBar
        ) &&
        bar != stx.chart.dataSegment.length - 1
      ) {
        return;
      }

      marker.lastBar = stx.chart.dataSegment[bar];
      const criticalCrosshairXValue = stx.width > 700 ? 1060 : 540
      var cw = marker.lastBar.candleWidth || stx.layout.candleWidth;
      if (criticalCrosshairXValue > CIQ.ChartEngine.crosshairX) {
        marker.node.style.left = "auto";
        marker.node.style.right =
          Math.round(
            container.clientWidth - stx.pixelFromBar(bar) - leftOffset
          ) + "px";
      } else {
        marker.node.style.left =
          Math.round(stx.pixelFromBar(bar) - leftOffset) + "px";
        marker.node.style.right = "auto";
      }
      var height = parseInt(getComputedStyle(marker.node).height, 10);
      if (CIQ.ChartEngine.crosshairY-stx.top < 100) {
        topOffset = -60;
      }
      var top = Math.round(
        CIQ.ChartEngine.crosshairY - stx.top - topOffset - height / 2
      );
      // if (top + height > stx.height) top = stx.height - height;
      // if (top < 0) top = 0;
      marker.node.style.top = top + "px";

      if (showBarHighlight && !stx.layout.crosshair) {
        const candleWidth =
          marker.lastBar.candleWidth || stx.layout.candleWidth;
        const left = stx.pixelFromBar(bar) - candleWidth / 2;
        let width = candleWidth;

        if (left + width > stx.chart.width) {
          // adjust width of last bar so it does not highlight past the edge of the chart into the y axis
          width = stx.chart.width - left;
        }

        highlightEl.style.display = "block";
        highlightEl.style.left = left + "px";
        highlightEl.style.width = width + "px";
      } else {
        highlightEl.style.display = "none";
      }
    }
    // backwards compatibility
    // temporarily disable overXAxis, overYAxis so the crosshairs don't hide if touch device and over Y axis (this can happen
    // due to the offset which we apply)
    if (stx.layout.crosshair) {
      var overXAxis = stx.overXAxis,
        overYAxis = stx.overYAxis;
      stx.overXAxis = stx.overYAxis = false;
      stx.doDisplayCrosshairs();
      stx.overXAxis = overXAxis;
      stx.overYAxis = overYAxis;
    }
  };

  function hideIfDisabled() {
    const { headsUp, crosshair } = stx.layout;
    const isFloating =
      (headsUp && headsUp.floating) || headsUp === "floating";

    const crosshairsOn =
      crosshair &&
      stx.displayCrosshairs &&
      ["static", null, undefined].includes(headsUp); // backwards compatibility

    if (stx.huTooltip && !isFloating && !crosshairsOn) {
      hideTooltip();
      return true;
    }

    return false;
  }

  function hideTooltip() {
    const { huTooltip } = stx;
    const { node } = huTooltip;
    if (!node) return;
    node.style.left = "-50000px";
    node.style.right = "auto";
    huTooltip.lastBar = {};
    if (huTooltip.highlightEl) huTooltip.highlightEl.style.display = "none";
  }

  function renderFunction() {
    // the tooltip has not been initialized with this chart.
    if (hideIfDisabled()) return;

    var bar = this.barFromPixel(this.cx),
      data = this.chart.dataSegment[bar];
    if (!data) {
      hideTooltip();
      return;
    }
    if (
      CIQ.Marker.Tooltip.sameBar(data, this.huTooltip.lastBar) &&
      bar != this.chart.dataSegment.length - 1
    ) {
      return;
    }
    var node = this.huTooltip.node;
    Array.from(node.parentElement.querySelectorAll("[auto]")).forEach(
      function (i) {
        i.remove();
      }
    );
    Array.from(
      node.parentElement.querySelectorAll("stx-hu-tooltip-field-value")
    ).forEach(function (i) {
      i.innerHTML = "";
    });

    var panel = this.chart.panel;
    var yAxis = panel.yAxis;
    var dupMap = {};
    var fields = [];
    fields.push({
      member: "DT",
      display: "DT",
      panel: panel,
      yAxis: yAxis
    });
    fields.push({
      member: "Close",
      display: "Close",
      panel: panel,
      yAxis: yAxis
    });
    dupMap.DT = dupMap.Close = 1;
    if (
      showChange &&
      CIQ.ChartEngine.isDailyInterval(this.layout.interval)
    ) {
      fields.push({
        member: "Change",
        display: "Change",
        panel: panel,
        yAxis: yAxis
      });
    }
    if (showOhl) {
      fields.push({
        member: "Open",
        display: "Open",
        panel: panel,
        yAxis: yAxis
      });
      fields.push({
        member: "High",
        display: "High",
        panel: panel,
        yAxis: yAxis
      });
      fields.push({
        member: "Low",
        display: "Low",
        panel: panel,
        yAxis: yAxis
      });
      dupMap.Open = dupMap.High = dupMap.Low = 1;
    }
    if (showVolume) {
      fields.push({
        member: "Volume",
        display: "Volume",
        panel: null,
        yAxis: null
      }); // null yAxis use raw value
      dupMap.Volume = 1;
    }
    if (showSeries) {
      var renderers = this.chart.seriesRenderers;
      for (var renderer in renderers) {
        var rendererToDisplay = renderers[renderer];
        if (rendererToDisplay === this.mainSeriesRenderer) continue;
        panel = this.panels[rendererToDisplay.params.panel];
        yAxis = rendererToDisplay.params.yAxis;
        if (!yAxis && rendererToDisplay.params.shareYAxis)
          yAxis = panel.yAxis;
        for (var id = 0; id < rendererToDisplay.seriesParams.length; id++) {
          var seriesParams = rendererToDisplay.seriesParams[id];
          // if a series has a symbol and a field then it maybe a object chain
          var sKey = seriesParams.symbol;
          var subField = seriesParams.field;
          if (!sKey) sKey = subField;
          else if (subField && sKey != subField)
            sKey = CIQ.createObjectChainNames(sKey, subField)[0];
          var display =
            seriesParams.display ||
            seriesParams.symbol ||
            seriesParams.field;
          if (sKey && !dupMap[display]) {
            fields.push({
              member: sKey,
              display: display,
              panel: panel,
              yAxis: yAxis,
              isSeries: true
            });
            dupMap[display] = 1;
          }
        }
      }
    }
    if (showStudies) {
      for (var study in this.layout.studies) {
        var sd = this.layout.studies[study];
        panel = this.panels[sd.panel];
        yAxis = panel && sd.getYAxis(this);
        for (var output in this.layout.studies[study].outputMap) {
          if (output && !dupMap[output]) {
            fields.push({
              member: output,
              display: output,
              panel: panel,
              yAxis: yAxis
            });
            dupMap[output] = 1;
          }
        }
        if (!dupMap[study + "_hist"]) {
          fields.push({
            member: study + "_hist",
            display: study + "_hist",
            panel: panel,
            yAxis: yAxis
          });
          fields.push({
            member: study + "_hist1",
            display: study + "_hist1",
            panel: panel,
            yAxis: yAxis
          });
          fields.push({
            member: study + "_hist2",
            display: study + "_hist2",
            panel: panel,
            yAxis: yAxis
          });
          dupMap[study + "_hist"] = 1;
        }
      }
    }
    for (var f = 0; f < fields.length; f++) {
      var obj = fields[f];
      var name = obj.member;
      var displayName = obj.display;
      var isRecordDate = name == "DT";
      if (
        isRecordDate &&
        !useDataZone &&
        !CIQ.ChartEngine.isDailyInterval(stx.layout.interval)
      )
        name = "displayDate"; // display date is timezone adjusted
      panel = obj.panel;
      yAxis = obj.yAxis;
      var labelDecimalPlaces = null;
      if (yAxis) {
        if (!panel || panel !== panel.chart.panel) {
          // If a study panel, use yAxis settings to determine decimal places
          if (yAxis.decimalPlaces || yAxis.decimalPlaces === 0)
            labelDecimalPlaces = yAxis.decimalPlaces;
          else if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0)
            labelDecimalPlaces = yAxis.maxDecimalPlaces;
        } else {
          // If a chart panel, then always display at least the number of decimal places as calculated by masterData (panel.chart.decimalPlaces)
          // but if we are zoomed to high granularity then expand all the way out to the y-axis significant digits (panel.yAxis.printDecimalPlaces)
          labelDecimalPlaces = Math.max(
            yAxis.printDecimalPlaces,
            panel.chart.decimalPlaces
          );
          //	... and never display more decimal places than the symbol is supposed to be quoting at
          if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0)
            labelDecimalPlaces = Math.min(
              labelDecimalPlaces,
              yAxis.maxDecimalPlaces
            );
        }
      }
      var dsField = null;
      // account for object chains
      var tuple = CIQ.existsInObjectChain(data, name);
      if (tuple) dsField = tuple.obj[tuple.member];
      else if (name == "Change") dsField = data.Close - data.iqPrevClose;

      var fieldName = displayName.replace(/^(Result )(.*)/, "$2");

      if (
        showInterpolation &&
        fields[f].isSeries &&
        (dsField === null || typeof dsField == "undefined")
      ) {
        // do this only for additional series and not the main series
        var seriesPrice = this.valueFromInterpolation(
          bar,
          fieldName,
          "Close",
          panel,
          yAxis
        );
        if (seriesPrice === null) break;
        dsField = seriesPrice;
      }
      if (
        (dsField || dsField === 0) &&
        (isRecordDate ||
          typeof dsField !== "object" ||
          dsField.Close ||
          dsField.Close === 0)
      ) {
        var fieldValue = "";
        if (dsField.Close || dsField.Close === 0) dsField = dsField.Close;
        if (dsField.constructor == Number) {
          if (!yAxis) {
            // raw value
            fieldValue = dsField;
            var intl = this.internationalizer;
            if (intl) {
              var l = intl.priceFormatters.length;
              var decimalPlaces = CIQ.countDecimals(fieldValue);
              if (decimalPlaces >= l) decimalPlaces = l - 1;
              fieldValue = intl.priceFormatters[decimalPlaces].format(
                fieldValue
              );
            }
          } else if (
            yAxis.originalPriceFormatter &&
            yAxis.originalPriceFormatter.func
          ) {
            // in comparison mode with custom formatter
            fieldValue = yAxis.originalPriceFormatter.func(
              this,
              panel,
              dsField,
              labelDecimalPlaces
            );
          } else if (
            yAxis.priceFormatter &&
            yAxis.priceFormatter != CIQ.Comparison.priceFormat
          ) {
            // using custom formatter
            fieldValue = yAxis.priceFormatter(
              this,
              panel,
              dsField,
              labelDecimalPlaces
            );
          } else {
            fieldValue = this.formatYAxisPrice(
              dsField,
              panel,
              labelDecimalPlaces,
              yAxis
            );
          }
        } else if (dsField.constructor == Date) {
          if (
            isRecordDate &&
            this.controls.floatDate &&
            this.controls.floatDate.innerHTML
          ) {
            if (this.chart.xAxis.noDraw) fieldValue = "N/A";
            else
              fieldValue = CIQ.displayableDate(this, panel.chart, dsField);
          } else {
            fieldValue = CIQ.yyyymmdd(dsField);
            if (!CIQ.ChartEngine.isDailyInterval(this.layout.interval)) {
              fieldValue += " " + dsField.toTimeString().substr(0, 8);
            }
          }
        } else {
          fieldValue = dsField;
        }
        var dedicatedField = node.querySelector(
          'stx-hu-tooltip-field[field="' + fieldName + '"]'
        );

        if (dedicatedField) {
          dedicatedField.querySelector(
            "stx-hu-tooltip-field-value"
          ).innerHTML = fieldValue;
          var fieldNameField = dedicatedField.querySelector(
            "stx-hu-tooltip-field-name"
          );
          if (fieldNameField.innerHTML === "") {
            fieldNameField.innerHTML = fieldName;
            if (CIQ.I18N && CIQ.I18N.localized)
              CIQ.I18N.translateUI(null, fieldNameField);
          }
        } else {
          var newField = document.createElement("stx-hu-tooltip-field");
          newField.setAttribute("auto", true);
          var newFieldName = document.createElement(
            "stx-hu-tooltip-field-name"
          );
          newFieldName.innerHTML = this.translateIf(fieldName);
          newField.appendChild(newFieldName);
          var newFieldValue = document.createElement(
            "stx-hu-tooltip-field-value"
          );
          newFieldValue.innerHTML = fieldValue;
          newField.appendChild(newFieldValue);
          node.appendChild(newField);
        }
      } else {
        var naField = node.querySelector(
          'stx-hu-tooltip-field[field="' + fieldName + '"]'
        );
        if (naField) {
          var naFieldNameField = naField.querySelector(
            "stx-hu-tooltip-field-name"
          );
          if (naFieldNameField.innerHTML !== "")
            naField.querySelector("stx-hu-tooltip-field-value").innerHTML =
              "n/a";
        }
      }
    }
    this.huTooltip.render();
  }

  container.addEventListener("mouseout", hideTooltip);

  stx.append("deleteHighlighted", function () {
    this.huTooltip.lastBar = {};
    this.headsUpHR();
  });
  stx.append("headsUpHR", renderFunction);
  stx.append("createDataSegment", renderFunction);
  stx.huTooltip = new CIQ.Marker.Tooltip({
    stx: stx,
    xPositioner: "bar",
    chartContainer: true,
    node: node
  });
};