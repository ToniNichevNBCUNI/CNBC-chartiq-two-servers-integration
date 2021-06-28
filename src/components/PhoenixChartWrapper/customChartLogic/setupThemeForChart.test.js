import setupThemeForChart from './setupThemeForChart';


describe('setupThemeForChart', () => {

  const stxx = {
    styles: {},
    draw: () => {}
  };

  beforeAll(() => {
    document.body.innerHTML = `
      <cq-context>
      </cq-context>
    `;
  });

  it('should activate day mode', () => {
    const expectedThemeValue = 'ciq-day';
    expect(setupThemeForChart({ theme: 'day' }, stxx)).toBe(expectedThemeValue);
  });

  it('should activate night mode', () => {
    const expectedThemeValue = 'ciq-night';
    expect(setupThemeForChart({ theme: 'night' }, stxx)).toBe(expectedThemeValue);
  });

  it('should activate default day mode', () => {
    const expectedThemeValue = 'ciq-day';
    expect(setupThemeForChart(null, stxx)).toBe(expectedThemeValue);
  });
});
