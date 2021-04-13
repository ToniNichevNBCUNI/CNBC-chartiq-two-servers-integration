/* eslint-disable guard-for-in, no-restricted-syntax */
const adjustPeriodicitySelector = (setVisible) => {

  
  
  document.querySelectorAll('cq-show-range > div').forEach( element => {
    element.classList.remove('chartTimeIntervalSelected');
    console.log(">@#@##@#@>>>", window.stxx.selectedTimeRange);
   });

  document.querySelector('.ciq-menu.ciq-period > cq-menu-dropdown > cq-menu-container').querySelectorAll('cq-item').forEach( element => {
    if(setVisible.includes(element.className) ) {
      element.style.display = 'block';
    }
    else {
      element.style.display = 'none';
    }
  });
};

export default adjustPeriodicitySelector;
