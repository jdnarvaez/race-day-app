import React from 'react';
import { Rnd } from 'react-rnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './TrackInfo.css';

class TrackInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      x : 100,
      y : window.cordova ? 35 : 25,
      width : 450,
      height : 180
    }
  }

  openTrackEmail = () => {
    const { track } = this.props;

    if (track && track.email) {
      window.open(`mailto:${track.email}`);
    }
  }

  openTrackUrl = () => {
    const { track } = this.props;

    if (track && track.website_url) {
      window.open(track.website_url, '_new');
    }
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
    const { openTrackEmail, openTrackUrl } = this;
    const { app, track } = this.props;
    const { x, y, width, height } = this.state;

    return (
      <Rnd
        className={`track-info ${track ? 'show' : 'hide'} ${window.cordova ? 'mobile' : ''}`}
        size={{ width: width, height: height }}
        position={{ x: x, y: y }}
        onDragStop={(e, d) => {
          this.setState({ x : d.x, y : d.y })
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.setState({ x : position.x, y : position.y, width : Math.max(25, ref.style.width), height : Math.max(25, ref.style.height) })
        }}
      >
        <div className="close" onClick={(e) => app.setActiveTrack(undefined)}><FontAwesomeIcon icon={faTimes} /></div>
        <div className="get-directions" onClick={navigateTo}><FontAwesomeIcon icon={faDirections} /></div>
        {track && <div className="detail-layout">
          <div className="district-container"><div className="district">{track.district}</div></div>
          <div className="details">
            <div className="trackname"><span style={{ display : 'block' }}>{track.name}</span></div>
            <div className="state">{track.state}</div>
            <div className="operator">{track.primary_contact_name}</div>
            <div className="phone">{track.primary_contact_phone}</div>
            <div className="email" onClick={openTrackEmail}>{track.email}</div>
            <div className="url" onClick={openTrackUrl}>{track.website_url}</div>
          </div>
        </div>}
      </Rnd>
  	);
  }
}

export default TrackInfo;
