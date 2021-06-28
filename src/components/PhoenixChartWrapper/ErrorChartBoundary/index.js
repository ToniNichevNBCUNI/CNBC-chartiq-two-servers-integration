import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className={styles.errorWrapper}>
          <div className={styles.msg}>
            <h3>Oops looks like chart could not be displayed!</h3>
            <p>Please contact cnbc support to provide details about what went wrong</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
