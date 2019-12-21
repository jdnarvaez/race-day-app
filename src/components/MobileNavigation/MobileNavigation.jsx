import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMapMarker, faMapMarked, faList, faCompass } from '@fortawesome/free-solid-svg-icons';

import './MobileNavigation.css';

class MobileNavigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      isApp : window.cordova !== undefined
    }
  }

  render() {
    const { app, searchMode } = this.props;
    const { width, isApp } = this.state;

    return (
      <div className={`mobile-navigation ${this.state.collapsed ? 'collapsed' : 'expanded'}`}>
        <div className={`ripple btn ${searchMode === 'location' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('location')} alt="">
          <FontAwesomeIcon icon={faMapMarked} className="icon" />
        </div>
        <div className={`ripple btn ${searchMode === 'currentLocation' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('currentLocation')}>
          <FontAwesomeIcon icon={faCompass} className="icon" />
        </div>
        <div className={`ripple btn track-mode ${searchMode === 'track' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('track')}>
          <FontAwesomeIcon icon={faMapMarker} className="map-marker" />
          <FontAwesomeIcon icon={faList} className="list" />
        </div>
        {window.BackgroundGeolocation && <div className={`ripple btn ${searchMode === 'trackLocator' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('trackLocator')}>
          <FontAwesomeIcon icon={faLocationArrow} className="icon" />
        </div>}
        {!isApp && <div className="app-logo">race day</div>}
      </div>
  	);
  }
}

export default MobileNavigation;
