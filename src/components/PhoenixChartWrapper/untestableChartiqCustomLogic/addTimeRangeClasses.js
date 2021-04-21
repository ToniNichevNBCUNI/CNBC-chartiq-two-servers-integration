/**
 * Adding missing class anmes for the time range menu items
 */
 const addTimeRangeClasses = () => {
    document.querySelector('[cq-name=menuPeriodicity]').querySelectorAll('cq-item').forEach(element => {
        const period = element.innerText.replace(' ', '').toLocaleLowerCase();
        const applyClassName = `item-hide-${period}`;
        element.classList.add(applyClassName);
    });
};

export default addTimeRangeClasses;
