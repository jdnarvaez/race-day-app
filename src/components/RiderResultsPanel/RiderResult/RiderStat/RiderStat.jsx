import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './RiderStat.css';

class RaceResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { width, height, rider } = this.props;
    const { logBookEntry } = this.state;

    return (
      <div className="rider-stat" style={this.props.style}>
        <div className="icon">
          <FontAwesomeIcon icon={this.props.icon} />
        </div>
        <div className="text">
          <div className="label">{this.props.label}</div>
          <div className="value">{this.props.value}</div>
        </div>
      </div>
  	);
  }
}

export default RaceResult;
