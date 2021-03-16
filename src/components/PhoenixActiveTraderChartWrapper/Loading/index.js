import React from 'react';

const styles = require('./styles.scss');

/**
 * HELPER COMPONENT TO DISPLAY LOADING ... SCREEN AND HANDLE ERRORS
 * @param {} props 
 */
const Loading = (props) => {
  if (props.error) {
    return (<div className={styles.errorWrapper}>
              <div className={styles.msg}>
                <h3>ChartIQ component not rendered!</h3> 
                <p>If you wnat to have ChartIQ component rendered,</p>
                <p>use <span>yarn start-dev-with-chart</span> instead of <span>start-dev</span></p>
              </div>
            </div>);
  } else {
    return (
    <div className={styles.wrapper}>
      <div className={styles.timeRange}><p> ... </p></div>
      <h1>Loading . . . </h1>
    </div>)
  }
} 

export default Loading;