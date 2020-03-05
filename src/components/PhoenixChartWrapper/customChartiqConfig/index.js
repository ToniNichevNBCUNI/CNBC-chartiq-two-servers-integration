/**
 * Custom chart configuration and import plugins here
 * Multiple configuration sets can be created and exported
 */
import { getDefaultConfig } from '../chartiq/_config';

export * from './resources';

export function getConfiguration() {
  const config = getDefaultConfig();

  // update chart configuration by modifying default configuration
  config.chartConfig.preferences.currentPriceLine = true;
  config.addOns.tooltip = null;

  // select and order symbol market tabs
  config.symbolLookupTabs = ['ALL', 'FX', 'STOCKS'];

  // uncomment following to have minimal interace
  // config.header = null
  config.footer = null;

  // turning off individual menus or re-ordering
  // config.menus = ['menuPeriodicity','menuDisplay', 'menuViews', 'menuStudies', 'menuEvents'];
  config.menus = ['menuPeriodicity', 'menuDisplay', 'menuStudies'];

  // show only few studies
  // config.menuStudies.includeOnly = ['ATR Bands', 'MACD', 'Moving Average'];
  return config;
}

export function getNoFooterConfig() {
  const config = getDefaultConfig();

  config.footer = null;
  return config;
}

export default getConfiguration();
