import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import './LoadingIndicator.css';

class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const style = {
      left : isMobileOnly ? '0px' : '77px',
    };

    const containerStyle = {
      transform: isMobileOnly ? 'translate(-50%, calc(-50% - 37.5px))' : 'translate(calc(-50% - 37.5px), -50%)'
    };

    return (
      <div className={`loading-indicator ${this.props.className}`} style={style}>
        <div className="loading-indicator-container" style={containerStyle}>
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
