import adjustPeriodicitySelector from './adjustPeriodicitySelector';


describe('adjustPeriodicitySelector', () => {



  beforeAll(() => {
    document.body.innerHTML = `
      <div id="toniTest" class='ciq-menu ciq-period'>
        <cq-menu-dropdown>
            <cq-menu-container>
                <cq-item class="item-hide-1d">1 D</cq-item>
                <cq-item class="item-hide-1w">1 W</cq-item>
                <cq-item class="item-hide-1mo">1 Mo</cq-item>
                <cq-item class="item-hide-3mo">3 Mo</cq-item>
                <cq-item class="item-hide-1min">1 Min</cq-item>
                <cq-item class="item-hide-5min">5 Min</cq-item>
                <cq-item class="item-hide-10min">10 Min</cq-item>
                <cq-item class="item-hide-15min">15 Min</cq-item>
                <cq-item class="item-hide-30min">30 Min</cq-item>
                <cq-item class="item-hide-1hour">1 Hour</cq-item>
                <cq-item class="item-hide-1day">1 Day</cq-item>
            </cq-menu-container>
        </cq-menu-dropdown>
      </div>
    `;
  });

  it('Set up correct periodicitity for 1 day', () => {
    // adjustPeriodicitySelector(['item-hide-1d', 'item-hide-1w', 'item-hide-1mo']);
    adjustPeriodicitySelector(['item-hide-1min', 'item-hide-5min', 'item-hide-10min', 'item-hide-15min', 'item-hide-30min', 'item-hide-1hour']);
    const selectors = document.querySelector('cq-menu-dropdown cq-menu-container').querySelectorAll('cq-item');
    expect(selectors[0].style.display).toBe('none');
    expect(selectors[1].style.display).toBe('none');
    expect(selectors[2].style.display).toBe('none');
    expect(selectors[3].style.display).toBe('none');
    expect(selectors[4].style.display).toBe('block');
    expect(selectors[5].style.display).toBe('block');
    expect(selectors[6].style.display).toBe('block');
    expect(selectors[7].style.display).toBe('block');
    expect(selectors[8].style.display).toBe('block');
    expect(selectors[9].style.display).toBe('block');
    expect(selectors[10].style.display).toBe('none');
  });

  it('Set up correct periodicitity for 1 month', () => {
    adjustPeriodicitySelector(['item-hide-1d', 'item-hide-1mo']);
    const selectors = document.querySelector('cq-menu-dropdown cq-menu-container').querySelectorAll('cq-item');
    expect(selectors[0].style.display).toBe('block');
    expect(selectors[1].style.display).toBe('none');
    expect(selectors[2].style.display).toBe('block');
    expect(selectors[3].style.display).toBe('none');
    expect(selectors[4].style.display).toBe('none');
    expect(selectors[5].style.display).toBe('none');
    expect(selectors[6].style.display).toBe('none');
    expect(selectors[7].style.display).toBe('none');
    expect(selectors[8].style.display).toBe('none');
    expect(selectors[9].style.display).toBe('none');
    expect(selectors[10].style.display).toBe('none');
  });


});
