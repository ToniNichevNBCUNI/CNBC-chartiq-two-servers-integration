import React from 'react'

const styles = require('./styles.scss');

class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className={styles.errorWrapper}>
          <div className={styles.msg}>
            <h3>ChartIQ component not rendered!</h3> 
            <p>If you want to have ChartIQ component rendered,</p>
            <p>use <span>(yarn/npm run) start-with-chart</span> instead of <span>yarn/npm start</span></p>
            <p>{this.state.error}</p>
          </div>
        </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary





