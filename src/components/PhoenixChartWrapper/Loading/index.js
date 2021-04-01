import React from 'react';

const styles = require('./styles.scss');

/**
 * HELPER COMPONENT TO DISPLAY LOADING ... SCREEN AND HANDLE ERRORS
 * @param {} props 
 */
const Loading = (props) => {
  if (props.error) {
    const err =  props.error + "";
    return (<div className={styles.errorWrapper}>
              <div className={styles.msg}>
                <h3>Chart error: </h3> 
                <p>{err}</p>
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