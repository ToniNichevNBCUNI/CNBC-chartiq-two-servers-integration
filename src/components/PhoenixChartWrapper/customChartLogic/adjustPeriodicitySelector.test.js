import adjustPeriodicitySelector from './adjustPeriodicitySelector';

const fs = require('fs');
const path = require('path');

const jQueryFile = fs.readFileSync(path.resolve(__dirname, '../__mocks__/jquery.js'), { encoding: 'utf-8' });

describe('adjustPeriodicitySelector', () => {
  const scriptEl = window.document.createElement('script');
  scriptEl.textContent = jQueryFile; // add jQuery file
  window.document.body.appendChild(scriptEl);

  it('should select none', () => {
    adjustPeriodicitySelector([]);
  });

  it('should select correct selector', () => {
    adjustPeriodicitySelector(['item-hide-1m']);
  });
});
