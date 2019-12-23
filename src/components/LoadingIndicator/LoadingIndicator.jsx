import React from 'react';
import { isMobile } from 'react-device-detect';

import './LoadingIndicator.css';

class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const style = {
      left : isMobile ? '0px' : '77px',
    };

    return (
      <div className={`loading-indicator ${this.props.className}`} style={style}>
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
        <div className="caption">Loading Tracks & Races...</div>
      </div>
    );
  }
}

export default LoadingIndicator;
