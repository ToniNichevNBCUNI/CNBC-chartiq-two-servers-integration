/* eslint-disable guard-for-in, no-restricted-syntax */
const adjustPeriodicitySelector = (setVisible) => {
  const selectors = [
    'item-hide-1m',
    'item-hide-5m',
    'item-hide-10m',
    'item-hide-15m',
    'item-hide-30m',
    'item-hide-1h',
    'item-hide-4h',
    'item-hide-1d',
    'item-hide-1w',
    'item-hide-1mo',
    'item-hide-3mo'
  ];
  for (const index in selectors) {
    const selector = selectors[index];
    if ($.inArray(selector, setVisible) === -1) {
      $(`.${  selector}`).css('display', 'none');
    } else {
      $(`.${  selector}`).css('display', 'block');
    }
  }
  if (setVisible.length < 1) {
    $('.ciq-period cq-menu-dropdown').css('display', 'none');
  } else {
    $('.ciq-period cq-menu-dropdown').css('display', 'block');
  }
};

export default adjustPeriodicitySelector;
