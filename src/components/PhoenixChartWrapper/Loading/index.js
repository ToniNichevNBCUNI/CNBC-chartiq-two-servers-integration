import React from 'react';

const styles = require('./styles.scss');

/**
 * HELPER COMPONENT TO DISPLAY LOADING ... SCREEN AND HANDLE ERRORS
 * @param {} props 
 */
const Loading = (props) => {
  if (props.error) {
    return (<div className={styles.wrapper}>
              <h3>Error loading ChartIQ component!</h3> 
              <p><b>{props.error.message}</b></p>
              <p>{props.error.stack}</p>
              <div><button onClick={ props.retry }>Retry</button></div>
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