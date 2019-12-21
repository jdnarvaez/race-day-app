import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faWindowMinimize, faSync } from '@fortawesome/free-solid-svg-icons';

import TrackRow from './TrackRow';

import './NearbyTrackList.css';

const ROW_HEIGHT = 150;

class NearbyTrackList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      maxHeight: innerHeight - 77 - 25 - 25 - 70,
      minimized: false
    }
  }

  renderRow = ({ index, key, style }) => {
    const { app, nearbyTracks, currentLocation } = this.props;
    const track = nearbyTracks[index];
    return (<div className="track-row-container" style={style} onClick={(e) => app.setActiveTrack(track)}><TrackRow app={app} track={track} currentLocation={currentLocation} key={track.id.toString()} /></div>);
  }

  render() {
    const { renderRow } = this;
    const { app, nearbyTracks } = this.props;
    const { maxHeight, minimized } = this.state;

    return (
      <div className={`nearby-track-list ${this.props.searchMode === 'trackLocator' ? 'show' : 'hide'}`}>
        <div className={`header ${nearbyTracks.length === 0 ? 'no-tracks' : '' }`}>
          <div className="title">
            {nearbyTracks.length === 0 && <div className="caption">no tracks within 100 miles</div>}
            {nearbyTracks.length > 0 && <div className="count">{nearbyTracks.length}</div>}
            {nearbyTracks.length === 1 && <div className="caption">track nearby</div>}
            {nearbyTracks.length > 1 && <div className="caption">tracks nearby</div>}
          </div>
          {minimized && <div className="maximize" onClick={(e) => this.setState({ minimized : false })}>
            <FontAwesomeIcon icon={faWindowMaximize} />
          </div>}
          {!minimized && <div className="minimize" onClick={(e) => this.setState({ minimized : true })}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </div>}
          <div className="refresh" onClick={(e) => app.refreshData()}>
            <FontAwesomeIcon icon={faSync} />
          </div>
        </div>
        {this.props.searchMode === 'trackLocator' && <List
          className={`nearby-track-row-list ${minimized ? 'minimized' : ''}`}
          height={minimized ? 0 : Math.min(maxHeight, nearbyTracks.length * ROW_HEIGHT)}
          itemCount={nearbyTracks.length}
          itemSize={ROW_HEIGHT - 10}
          width={innerWidth - 46}
        >
          {renderRow}
        </List>}
      </div>
  	);
  }
}

export default NearbyTrackList;
