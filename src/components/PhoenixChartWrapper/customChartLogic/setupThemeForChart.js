const setupThemeForChart = (queryParams, chartEngine) => {
  let selectedTheme = 'ciq-day';
  if (queryParams && typeof queryParams.theme !=='undefined' && queryParams.theme) {
    selectedTheme = queryParams.theme === 'night' ? 'ciq-night' : 'ciq-day';
    if (queryParams.theme === 'night') {
      document.querySelector('cq-context').classList.add('ciq-night');
      // clear out the old styles to allow new ones to be cached in; and redraw.
      // eslint-disable-next-line no-param-reassign
      chartEngine.styles={};
      chartEngine.draw();
    }
  }
  return selectedTheme;
};

export default setupThemeForChart;
