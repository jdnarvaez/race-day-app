import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMapMarker, faMapMarked, faList, faCompass, faBookOpen } from '@fortawesome/free-solid-svg-icons';

import './MobileNavigation.css';

class MobileNavigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      isApp : window.cordova !== undefined
    }
  }

  //TODO: SETTINGS PANEL, FAVORITES PANEL, RIDERS PANEL FOR STATS ETC
  // <div className={`ripple btn ${activePanelIndex === 1 ? 'active' : ''}`} onClick={(e) => app.setActivePanelIndex(1)}>
  //   <FontAwesomeIcon icon={faBookOpen} className="icon" />
  // </div>

  render() {
    const { app, searchMode, activePanelIndex, width } = this.props;
    const { isApp } = this.state;
    // const numTabs = window.BackgroundGeolocation ? 5 : 4;
    const numTabs = window.BackgroundGeolocation ? 4 : 3;
    const tabWidth = width / numTabs;
    const marginLeft = (activePanelIndex === 0 ? (searchMode === 'location' ? 0 : (searchMode === 'currentLocation' ? tabWidth : (searchMode === 'track' ? tabWidth * 2 : tabWidth * 3))) : ((numTabs - 1) * tabWidth));

    return (
      <div className={`mobile-navigation ${this.state.collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="tab-indicator">
          <div className="active-tab" style={{ width : `${tabWidth}px`, marginLeft : `${marginLeft}px` }}/>
        </div>
        <div className={`ripple btn ${activePanelIndex === 0 && searchMode === 'location' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('location')} alt="">
          <FontAwesomeIcon icon={faMapMarked} className="icon" />
        </div>
        <div className={`ripple btn ${activePanelIndex === 0 && searchMode === 'currentLocation' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('currentLocation')}>
          <FontAwesomeIcon icon={faCompass} className="icon" />
        </div>
        <div className={`ripple btn track-mode ${activePanelIndex === 0 && searchMode === 'track' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('track')}>
          <FontAwesomeIcon icon={faMapMarker} className="map-marker" />
          <FontAwesomeIcon icon={faList} className="list" />
        </div>
        {window.BackgroundGeolocation && <div className={`ripple btn ${activePanelIndex === 0 && searchMode === 'trackLocator' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('trackLocator')}>
          <FontAwesomeIcon icon={faLocationArrow} className="icon" />
        </div>}

      </div>
  	);
  }
}

export default MobileNavigation;
