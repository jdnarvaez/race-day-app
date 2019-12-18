import React from 'react';
import './MobileTrackInfo.css';

class MobileTrackInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width : innerWidth - 50,
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

  render() {
    const { openTrackEmail, openTrackUrl } = this;
    const { app, track } = this.props;
    const { width } = this.state;

    return (
      <div className={`mobile-track-info ${track ? 'show' : 'hide'}`} style={{ width : `${width}px`}}>
        <div className="close" onClick={(e) => app.setActiveTrack(undefined)}>&times;</div>
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
      </div>
  	);
  }
}

export default MobileTrackInfo;
