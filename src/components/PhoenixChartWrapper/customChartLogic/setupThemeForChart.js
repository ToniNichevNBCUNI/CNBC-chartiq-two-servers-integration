import { CIQ } from 'chartiq/js/chartiq';

const setupThemeForChart = (queryParams) => {
  const UIStorage = new CIQ.NameValueStore();
  const UIThemes = $('cq-themes');
  if (queryParams && queryParams.theme) {
    if (UIThemes[0].initialize) {
      UIThemes[0].initialize({
        builtInThemes: { 'ciq-day': 'Day', 'ciq-night': 'Night' },
        defaultTheme: queryParams.theme === 'night' ? 'ciq-night' : 'ciq-day',
        nameValueStore: UIStorage
      });
    }
    return queryParams.theme === 'night' ? 'ciq-night' : 'ciq-day';
  }
  if (UIThemes[0].initialize) {
    UIThemes[0].initialize({
      builtInThemes: { 'ciq-day': 'Day', 'ciq-night': 'Night' },
      defaultTheme: 'ciq-day',
      nameValueStore: UIStorage
    });
  }
  return 'ciq-day';
};

export default setupThemeForChart;
