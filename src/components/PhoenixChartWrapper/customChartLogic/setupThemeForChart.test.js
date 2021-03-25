import setupThemeForChart from './setupThemeForChart';

const fs = require('fs');
const path = require('path');

const jQueryFile = fs.readFileSync(path.resolve(__dirname, '../__mocks__/jquery.js'), { encoding: 'utf-8' });

describe('setupThemeForChart', () => {
  beforeAll(() => {
    // load the scripts
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = jQueryFile; // add jQuery file
    window.document.body.appendChild(scriptEl);

    document.body.innerHTML = `
      <cq-themes>
        <cq-themes-builtin cq-no-close="true">
          <template></template>
          <cq-item>
           <translate original="Day">Day</translate>
          </cq-item>
          <cq-item>
            <translate original="Night">Night</translate>
          </cq-item>
        </cq-themes-builtin>
        <cq-themes-custom cq-no-close="true">
          <template></template>
        </cq-themes-custom>
        <cq-separator cq-partial="true">
        </cq-separator>
        <cq-item stxtap="newTheme()">
        <cq-plus>
        </cq-plus>New Theme</cq-item>
      </cq-themes>
    `;
  });

  it('should activate day mode', () => {
    const expectedThemeValue = 'ciq-day';
    expect(setupThemeForChart({ theme: 'day' })).toBe(expectedThemeValue);
  });

  it('should activate night mode', () => {
    const expectedThemeValue = 'ciq-night';
    expect(setupThemeForChart({ theme: 'night' })).toBe(expectedThemeValue);
  });

  it('should activate default day mode', () => {
    const expectedThemeValue = 'ciq-day';
    expect(setupThemeForChart()).toBe(expectedThemeValue);
  });
});
