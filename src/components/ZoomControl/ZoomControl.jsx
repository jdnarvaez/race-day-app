import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import './ZoomControl.css';

class ZoomControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  zoomIn = () => {
    const { map, currentZoom, maxZoom } = this.props;

    if (currentZoom + 1 <= maxZoom) {
      map.setZoom(currentZoom + 1);
    }
  }

  zoomOut = () => {
    const { map, currentZoom, minZoom } = this.props;

    if (currentZoom - 1 >= minZoom) {
      map.setZoom(currentZoom - 1);
    }
  }

  render() {
    const { currentZoom, minZoom, maxZoom } = this.props;

    return (
      <div className={`zoom-control ${this.props.className}`}>
        <div className={`ripple plus ${currentZoom === maxZoom ? 'disabled' : ''}`} onClick={this.zoomIn}>
          <FontAwesomeIcon icon={faPlus} className="icon" />
        </div>
        <div className={`ripple minus ${currentZoom === minZoom ? 'disabled' : ''}`} onClick={this.zoomOut}>
          <FontAwesomeIcon icon={faMinus} className="icon" />
        </div>
      </div>
    );
  }
}

export default ZoomControl;
