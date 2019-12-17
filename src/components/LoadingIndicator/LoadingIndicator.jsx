import React from 'react';

import './LoadingIndicator.css';

class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={`loading-indicator ${this.props.className}`}>
        <div className="loading-indicator-container">
          <div className="loading-indicator-wave">
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
          </div>
        </div>
      </div>
    );
  }
}

export default LoadingIndicator;
