// import { CIQ } from 'chartiq/js/chartiq';

/**
 * Contains calls that allow a native iOS and Android application to interface with the charting library
 * without having to clutter either Swift/Objective C or Java source with unnecessary Javascript.
 *
 * Please note that all functions and variables are exposed globally on the webview.
 *
 * All methods were designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
 *
 * @namespace NativeLibraryBridge
 */

const nativeSdkBridge = (CIQ) => {
  /**
   * Will be set to `true` when an Android device is bring used.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * @memberof NativeLibraryBridge
   * @boolean
   * @default false
   */
  const isAndroid = false;

  /**
   * String representing the class for CIQ's default light theme.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * @memberof NativeLibraryBridge
   * @string
   */
  const dayCss = 'ciq-day';

  /**
   * String representing the class for CIQ's default dark theme.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   * @memberof NativeLibraryBridge
   * @string
   */
  const nightCss = 'ciq-night';

  /**
   * Allow console logging in iOS. This will overwrite the default console logging on iOS to return messages via webkit.messageHandlers.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   * @memberof NativeLibraryBridge
   */
  function proxyLogger() {
    const originals = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    console.log = function () {
      webkit.messageHandlers.logHandler.postMessage({
        method: 'LOG',
        arguments: JSON.parse(JSON.stringify(arguments))
      });

      return originals.log.apply(this, arguments);
    };

    console.warn = function () {
      webkit.messageHandlers.logHandler.postMessage({
        method: 'WARN',
        arguments: JSON.parse(JSON.stringify(arguments))
      });

      return originals.warn.apply(this, arguments);
    };

    console.error = function () {
      webkit.messageHandlers.logHandler.postMessage({
        method: 'ERROR',
        arguments: JSON.parse(JSON.stringify(arguments))
      });

      return originals.error.apply(this, arguments);
    };
  }

  function allowZoomAndScroll() {
    stxx.allowZoom = true;
    stxx.allowScroll = true;
  }
  /**
   * Gathers the necessary information for any HUD based on cursor position and returns that data.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * This function will provide Open, High, Low, Close and Volume for a given quote.
   * @memberof NativeLibraryBridge
   */
  function getHudDetails() {
    const data = {};
    const tick = stxx.barFromPixel(stxx.cx);
    const prices = stxx.chart.xaxis[tick];

    if (prices !== null) {
      if (prices.data) {
        data.open = stxx.formatPrice(prices.data.Open);
        data.close = stxx.formatPrice(prices.data.Close);
        data.high = stxx.formatPrice(prices.data.High);
        data.low = stxx.formatPrice(prices.data.Low);
        data.volume = CIQ.condenseInt(prices.data.Volume);
      }
    }
    if (isAndroid) {
      return data;
    }

    return JSON.stringify(data);
  }

  // ////////////////////////
  /** * Chart functions ** */
  // //////////////////////

  /**
   * Native wrapper for {@link CIQ.ChartEngine#setPeriodicity}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * Only accepts arguments individually and passes them into a params object
   *
   * @param {number} params.period The number of elements from masterData to roll-up together into one data point on the chart (candle,bar, etc). If set to 30 in a candle chart, for example, each candle will represent 30 raw elements of `interval/timeUnit` type.
   * @param {string} [params.timeUnit] Type of data requested. Valid values are "millisecond","second","minute","day","week", "month" or 'tick'. If not set, will default to "minute". **"hour" is NOT a valid timeUnit. Use `timeUnit:"minute", interval:60` instead**
   * @param {string} [params.interval] Further qualifies pre-rolled details of intra-day `timeUnits` ("millisecond","second","minute") and will be converted to “1” if used with "day","week" or  "month" 'timeUnit'. Some feeds provide data that is already rolled up. For example, there may be a feed that provides 5 minute bars. To let the chart know you want that 5-minute bar from your feed instead of having the chart get individual 1 minute bars and roll them up, you would set the `interval` to '5' and `timeUnit` to 'minute'
   * @memberof NativeLibraryBridge
   */
  function setPeriodicity(period, interval, timeUnit) {
    const params = {
      period,
      interval,
      timeUnit
    };

    stxx.setPeriodicity(params);
  }

  /**
   * Native wrapper for {@link CIQ.ChartEngine#loadChart}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * Unlike {@link CIQ.ChartEngine#loadChart}, this function only accepts a symbol and data.
   * If you need more functionality you to manually call the library implementation of loadChart.
   *
   * If a push method is supplying data to callNewChart you will need to make use of the chartIQView.isChartAvailable()
   * method for your initial data push. The pseudocode in the example gives one instance on how to use the flag.
   * @param {string} symbol The new symbol for your chart
   * @param {array} data Static data in an array to load the chart with
   * @memberof NativeLibraryBridge
   * @example
   * if(chartIQView.isChartAvailable() {
   * 	pushData = retrievePushData()
   * 	chartIQView.push(pushData)
   * } else{ repeat check via polling for the isChartAvailable flag }
   */
  function callNewChart(symbol, data) {
    if (!symbol)  { symbol = stxx.chart.symbol; }
    const loader = document.querySelector('cq-loader');
    if (loader) { loader.show(); }

    const cb = function () {
      if (loader) { loader.hide(); }
      if (!isAndroid) { webkit.messageHandlers.newSymbolCallbackHandler.postMessage(symbol); }
    };

    stxx.loadChart(symbol, {
      masterData: data
    }, cb);
  }

  /**
   * Native wrapper for {@link CIQ.ChartEngine#setChartType}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   *  Will remove any aggregation type and switch your chart to display the new chartType.
   *
   * Valid chartTypes include: Candle, Bar, Colored Bar, Line, Hollow Candle, Mountain and Baseline.
   *
   * This function should not be used for setting Aggregations. Instead use setAggregationType
   * @see {@tutorial Chart Styles and Types}
   * @param {string} chartType Type of chart to display
   * @memberof NativeLibraryBridge
   */
  function setChartType(chartType) {
    stxx.setChartType(chartType);
  }

  /**
   * Native wrapper for {@link CIQ.ChartEngine#setAggregationType}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * Valid aggregation types include: Heikin Ashi, Kagi, Renko, Range Bars, Point & Figure.
   *
   * This function should not be used to set chartTypes. Instead use setChartType
   * @see {@tutorial Chart Styles and Types}
   * @param {string} aggregationType Type of chart to display
   * @memberof NativeLibraryBridge
   */
  function setAggregationType(aggregationType) {
    stxx.setAggregationType(aggregationType);
  }

  /**
   * Will toggle the crosshairs on or off.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * @param boolean
   * @memberof NativeLibraryBridge
   */
  function enableCrosshairs(active) {
    stxx.layout.crosshair = active;
    stxx.doDisplayCrosshairs();
    stxx.changeOccurred('layout');
  }

  /**
   * Will return any currentVectoParameter.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * @see {@link CIQ.ChartEngine#currentVectorParameters}
   * @memberof NativeLibraryBridge
   */
  function getCurrentVectorParameters() {
    return stxx.currentVectorParameters;
  }

  /**
   * Used to set currentVectoParameters and any values for it.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   * @param parameter
   * @param value
   * @see {@link CIQ.ChartEngine#currentVectorParameters}
   * @memberof NativeLibraryBridge
   */

  function setCurrentVectorParameters(parameter, value) {
    stxx.currentVectorParameters[parameter] = value;
  }

  /**
   * Native wrapper for {@link CIQ.ChartEngine#addSeries}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * Can set a Series as a comparison and specify line color.
   * @param {string} symbol Symbol to set
   * @param {string} hexColor Color for your symbol to be displayed as
   * @param {boolean} isComparison Boolean telling the chart whether the symbol should be compared to the main symbol
   * @memberof NativeLibraryBridge
   */
  function addSeries(symbol, hexColor, isComparison) {
    const parameters = {
      color: hexColor,
      isComparison
    };

    stxx.addSeries(symbol, parameters);
  }

  /**
   * Native wrapper for {@link CIQ.ChartEngine#removeSeries}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * Removes a selected symbol from the chart's series
   * @param {string} symbol Symbol to remove OR the series ojbect itself
   * @memberof NativeLibraryBridge
   */
  function removeSeries(symbol) {
    stxx.removeSeries(symbol);
  }

  /**
   * Sets the chart theme between 'day' or 'night' or none by adding in CSS classes to the chart's context.
   * Also clears the chart containers backgroundColor and resets the engines styles.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * Adding one class will remove the other, to remove both set the theme to none
   * @param {String}  theme Theme to set either 'day', 'night' or none
   * @memberof NativeLibraryBridge
   */
  function setTheme(theme) {
    const context = $('div[cq-context="true"]');

    if (theme.toLowerCase() === 'day') {
      context.removeClass(nightCss);
      context.addClass(dayCss);
    } else if (theme.toLowerCase() === 'night') {
      context.removeClass(dayCss);
      context.addClass(nightCss);
    } else if (theme.toLowerCase() === 'none') {
      context.removeClass(nightCss);
      context.removeClass(dayCss);
    } else {
      return;
    }

    stxx.chart.container.style.backgroundColor = '';
    stxx.styles = {};
    stxx.draw();
  }


  // ////////////////////////
  /** * Study functions ** */
  // //////////////////////

  /**
   * Native wrapper for {@link CIQ.Studies.addStudy}.
   *
   * Adds a specific study to the chart.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * @param {String} studyName Study to add from the {@link CIQ.Studies.studyLibrary}
   * @param {Object} [inputs] Object containing custom inputs for instantiating the study
   * @param {Object} [outputs] Object containing custom outputs for instantiating the study
   * @param {Object} [parameters] Object containing custom parameters if supported/required by the study
   * @memberof NativeLibraryBridge
   */
  function addStudy(studyName, inputs, outputs, parameters) {
    CIQ.extend(CIQ.Studies.studyLibrary[studyName], { panelHeight: 65 });
    CIQ.Studies.addStudy(stxx, studyName, inputs, outputs, parameters);
  }

  /**
   * Removes an active study in the chart engine's layout from the chart.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * @param {String} studyName The name of the study as it appears in the chart engines layout
   * @memberof NativeLibraryBridge
   */
  function removeStudy(studyName) {
    const studyList = stxx.layout.studies;
    for (const study in studyList) {
      const sd = studyList[study];
      if (sd.name === studyName) {
        CIQ.Studies.removeStudy(stxx, sd);
      }
    }
  }

  /**
   * Convenience function to remove all studies on the chart at once.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * @memberof NativeLibraryBridge
   */
  function removeAllStudies() {
    const studyList = stxx.layout.studies;
    for (const study in studyList) {
      const sd = studyList[study];
      CIQ.Studies.removeStudy(stxx, sd);
    }
  }

  /**
   * Returns an array of all the studies in the {@link CIQ.Studies.studyLibrary} with a shortName derived from the key.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * Used for gathering all available studies a user can access
   * @return {Array} Array of studies with shortName of study
   * @memberof NativeLibraryBridge
   */
  function getStudyList() {
    const result = [];

    /*
     * If an array is part of the study inputs then Android and iOS just transforms the object to a string when the JSON transform happens.
     * That "array" string is then passed back to the library when the study is added and the app breaks.
     * By default just make sure the first option in the array is chosen and sent to the client side.
     * This will not affect the study options selection inputs as that is being handled by getStudyParameters.
     */
    function changeInputArray(inputs) {
      for (const input in inputs) {
        const values = inputs[input];
        if (Array.isArray(values) && values.length > 0) {
          inputs[input] = inputs[input][0];
        }
      }

      return inputs;
    }

    for (const key in CIQ.Studies.studyLibrary) {
      CIQ.Studies.studyLibrary[key].shortName = key;
      const study = CIQ.clone(CIQ.Studies.studyLibrary[key]);
      if (study.inputs) { study.inputs = changeInputArray(study.inputs); }
      result.push(study);
    }

    return JSON.stringify(result);
  }

  /**
   * Returns the active studies in the chart engine's layout.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * *Note:* For Android devices this will return a raw, unstringified, array of studies
   * @return {String} The JSON stringified list of studies
   * @memberof NativeLibraryBridge
   */
  function getActiveStudies() {
    const result = [];

    // we don't need the whole study object. Just the name, type, and study options
    // if you pass the whole study stringified back to Java don't be surprised if there are issues
    for (const key in stxx.layout.studies) {
      const trimObject = {};
      const study = stxx.layout.studies[key];
      trimObject.shortName = key;
      trimObject.name = study.name;
      trimObject.type = study.type;
      trimObject.inputs = study.inputs;
      trimObject.outputs = study.outputs;
      trimObject.parameters = study.parameters;
      result.push(trimObject);
    }

    if (isAndroid) {
      return result;
    }

    const seen = [];
    return JSON.stringify(result, (key, val) => {
      if (val !== null && typeof val === 'object') {
        if (seen.indexOf(val) >= 0) {
          return;
        }
        seen.push(val);
      }
      return val;
    });
  }

  // temporary iOS helper function
  function getAddedStudies() {
    const list = [];
    const s = stxx.layout.studies;
    const seen1 = [];
    const seen2 = [];
    const seen3 = [];

    function isUnique(arr) {
      return function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (arr.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          arr.push(value);
        }
        return value;
      };
    }

    for (const n in s) {
      const sd = s[n];
      const inputs = JSON.stringify(sd.inputs, isUnique(seen1));
      const outputs = JSON.stringify(sd.outputs, isUnique(seen2));
      const parameters = JSON.stringify(sd.parameters, isUnique(seen3));
      list.push(`${sd.name  }___${  inputs  }___${  outputs  }___${  parameters}`);
    }

    const joinedList = list.join('|||');
    return joinedList;
  }

  /**
   * Given an active study name this will update the study based on key value pair you pass in to a {@link CIQ.Studies.DialogHelper}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * If the given key is not found in the DialogHelpers inputs then the key will be searched for in DialogHelper.outputs and try to update them instead
   *
   * @param {String} name Name of the study from the chart engine's layout
   * @param {String} key Key to set in the studies corresponding DialogHelper
   * @param {String} value Value to set in the studies corresponding DialogHelper
   * @memberof NativeLibraryBridge
   */
  function setStudy(name, key, value) {
    const s = stxx.layout.studies;
    let selectedSd = {};
    for (const n in s) {
      const sd = s[n];
      if (sd.name === name) {
        selectedSd = sd;
      }
    }

    const helper = new CIQ.Studies.DialogHelper({
      sd: selectedSd,
      stx: stxx
    });
    let isFound = false;
    const newInputParameters = {};
    const newOutputParameters = {};

    for (const x in helper.inputs) {
      const input = helper.inputs[x];
      if (input.name === key) {
        isFound = true;
        if (input.type === 'text' || input.type === 'select') {
          newInputParameters[key] = value;
        } else if (input.type === 'number') {
          newInputParameters[key] = parseInt(value, 10);
        } else if (input.type === 'checkbox') {
          // eslint-disable-next-line eqeqeq
          newInputParameters[parameter] = (value != 'false');
        }
      }
    }
    if (isFound === false) {
      for (const x in helper.outputs) {
        const output = helper.outputs[x];
        if (output.name === key) {
          newOutputParameters[key] = value;
        }
      }
    }
    helper.updateStudy({
      inputs: newInputParameters,
      outputs: newOutputParameters
    });
  }

  /**
   * Will return the default parameters of a study if it is not active, or actual parameters for an active study.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * *Note:* For Android devices this will return the raw unstringified parameters
   * @param {string} studyName Study to get parameters for
   * @param {string} prop What to return for the study.  Valid values: "inputs", "outputs", "parameters".  Default is "outputs".
   * @returns {String} JSON stringified parameters from the DialogHelper
   * @memberof NativeLibraryBridge
   * @since 6.1.0 second argument changed from boolean isInputs to string prop.  If prop==true, will return inputs, as before.
   */
  function getStudyParameters(studyName, prop) {
    const params = {
      stx: stxx
    };
    if (stxx.layout.studies && stxx.layout.studies[studyName]) {
      params.sd = stxx.layout.studies[studyName];
    } else {
      params.name = studyName;
    }
    const helper = new CIQ.Studies.DialogHelper(params);
    let parameters;

    switch (prop) {
    case 'inputs':
    case true:
      parameters = helper.inputs;
      break;
    case 'parameters':
      parameters = helper.parameters;
      break;
    default:
      parameters = helper.outputs;
    }

    if (isAndroid) {
      return parameters;
    }

    return JSON.stringify(parameters);
  }

  /**
   * Given an active study name this will update the study based on key value pair you pass in to a {@link CIQ.Studies.DialogHelper}.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * By default this will assume that key belongs to DialogHelper.outputs unless `isInput` is `true`
   *
   * @param {String} studyName  Name of the study from the chart engine's layout
   * @param {String} key Key to set in the studies corresponding DialogHelper
   * @param {String} value Value to set in the studies corresponding DialogHelper
   * @param {Boolean} isInput Boolean telling to update input instead of outputs
   * @memberof NativeLibraryBridge
   */
  function setStudyParameter(studyName, key, value, isInput) {
    const helper = new CIQ.Studies.DialogHelper({
      sd: stxx.layout.studies[studyName],
      stx: stxx
    });

    if (isInput) {
      helper.updateStudy({
        inputs: {
          key: value
        },
        outputs: {}
      });
    } else {
      helper.updateStudy({
        inputs: {},
        outputs: {
          key: value
        }
      });
    }
  }

  // //////////////////////////////
  /** * Chart Event Listeners ** */
  // ////////////////////////////

  /**
   * Sets a callbackListener with a type of drawing.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * For more info on adding event callbacks to the chart see {@link CIQ.ChartEngine#addEventListener}.
   * @memberof NativeLibraryBridge
   */
  function addDrawingListener() {
    stxx.addEventListener('drawing', (drawingObject) => {
      const s = drawingObject.drawings;
      const drawings = [];

      for (const n in s) {
        const drawing = s[n];
        drawings.push(drawing.serialize());
      }

      const stringifiedDrawings = JSON.stringify(drawings);

      if (isAndroid) {
        QuoteFeed.drawingChange(stringifiedDrawings);
      } else {
        webkit.messageHandlers.drawingHandler.postMessage(stringifiedDrawings);
      }
    });
  }

  /**
   * Sets a callbackListener with a type of layout.
   *
   * Designed to be used with mobile sample interfaces. See {@tutorial Getting Started on Mobile} for more details.
   *
   * For more info on adding event callbacks to the chart see {@link CIQ.ChartEngine#addEventListener}.
   * @memberof NativeLibraryBridge
   */
  function addLayoutListener() {
    stxx.addEventListener('layout', (layoutObject) => {
      // Guard against trying to serialize circular objects and filter out duplicates
      const seen = [];

      function replacer(key, val) {
        if (val !== null && typeof val === 'object') {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      }

      const stringifiedLayout = JSON.stringify(layoutObject.layout, replacer);

      if (isAndroid) {
        QuoteFeed.layoutChange(stringifiedLayout);
      } else {
        webkit.messageHandlers.layoutHandler.postMessage(stringifiedLayout);
      }
    });
  }

  function updateChartLastPrice(lastPrice) {
    if (!window?.stxx) { return; }

    const stxx = window.stxx;

    if (!stxx?.masterData || !stxx?.chart?.dataSegment) { return; }
    if (!lastPrice) { return; }

    const chartDataLastDisplayedPoint = stxx.chart.dataSegment[stxx?.chart?.dataSegment?.length -1] || null;
    const lastSymbolValue = parseFloat(lastPrice);
    if (!chartDataLastDisplayedPoint) { return; }
    if (
      chartDataLastDisplayedPoint.Close !== null &&
      lastSymbolValue !== chartDataLastDisplayedPoint.Close
    ) {
      if (stxx.currentBase === 'today') {
        // find index of last display data point + update set of data which is used for last displayed data segment
        const indexOfLastDisplayedDataPoint = stxx.masterData.findIndex(data => data.Date === chartDataLastDisplayedPoint.Date);
        const lastDisplayDataSegmentArray = stxx.masterData.slice(indexOfLastDisplayedDataPoint, indexOfLastDisplayedDataPoint + 5);
        lastDisplayDataSegmentArray.map(dataObject => dataObject.Close = lastSymbolValue)
        stxx.updateChartData(lastDisplayDataSegmentArray);
      } else {
        stxx.updateChartData(
          [{
            DT: chartDataLastDisplayedPoint.DT,
            Open: chartDataLastDisplayedPoint.Open,
            High: chartDataLastDisplayedPoint.High,
            Low: chartDataLastDisplayedPoint.Low,
            Close: lastSymbolValue,
            Volume: chartDataLastDisplayedPoint.Volume
          }],
        );
      }
    }
  }

  return {
    proxyLogger,
    getHudDetails,
    setPeriodicity,
    callNewChart,
    setChartType,
    setAggregationType,
    enableCrosshairs,
    getCurrentVectorParameters,
    setCurrentVectorParameters,
    addSeries,
    removeSeries,
    setTheme,
    addStudy,
    removeStudy,
    removeAllStudies,
    getStudyList,
    getActiveStudies,
    getAddedStudies,
    setStudy,
    getStudyParameters,
    setStudyParameter,
    addDrawingListener,
    allowZoomAndScroll,
    addLayoutListener,
    updateChartLastPrice,
  };
};

export default nativeSdkBridge;
