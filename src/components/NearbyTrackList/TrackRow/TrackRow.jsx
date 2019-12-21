import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections } from '@fortawesome/free-solid-svg-icons';
import './TrackRow.css';

class TrackRow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  navigateTo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { track } = this.props;

    if (window.cordova) {
      directions.navigateTo(track.position.lat, track.position.lng);
    } else {
      const link = document.createElement('a');
      link.href = `geo:${track.position.lat},${track.position.lng}`;
      link.click();
      link.remove();
    }
  }

  render() {
    const { app, track, currentLocation } = this.props;

    return (
      <div className={`track-row`} style={{ width : `${innerWidth - 50}px` }}>
        <div className="detail-layout">
          <div className="district-container"><div className="district">{track.district}</div></div>
          <div className="details">
            <div className="trackname"><span style={{ display : 'block' }}>{track.name}</span></div>
            <div className="distance">{`${Math.round(track.position.distanceTo(currentLocation) * 0.000621371)} miles away`}</div>
          </div>
          <div className="get-directions" onClick={this.navigateTo}><FontAwesomeIcon icon={faDirections} /></div>
        </div>
      </div>
  	);
  }
}

export default TrackRow;
