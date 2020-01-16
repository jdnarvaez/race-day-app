import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMapMarker, faMapMarked, faList, faCompass, faBook, faTasks, faUsers, faCogs } from '@fortawesome/free-solid-svg-icons';

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

  render() {
    const { app, searchMode, activePanelIndex, width } = this.props;
    const { isApp } = this.state;
    const numMapTabs = window.BackgroundGeolocation ? 3 : 2;
    const numPanels = 1;
    const numTabs = numMapTabs + numPanels;
    const tabWidth = width / numTabs;
    const marginLeft = (activePanelIndex === 0 ? (searchMode === 'location' ? 0 : (searchMode === 'track' ? tabWidth : 2 * tabWidth)) : ((activePanelIndex - 1) * tabWidth + ((numTabs - numPanels) * tabWidth)));

    // <div className={`ripple btn ${activePanelIndex === 4 ? 'active' : ''}`} onClick={(e) => app.setActivePanelIndex(4)}>
    //   <FontAwesomeIcon icon={faCogs} />
    // </div>
    // <div className={`ripple btn ${activePanelIndex === 2 ? 'active' : ''}`} onClick={(e) => app.setActivePanelIndex(2)} style={buttonStyle}>
    //   <FontAwesomeIcon icon={faTasks} className="icon" />
    // </div>
    // <div className={`ripple btn ${activePanelIndex === 3 ? 'active' : ''}`} onClick={(e) => app.setActivePanelIndex(3)} style={buttonStyle}>
    //   <FontAwesomeIcon icon={faUsers} className="icon" />
    // </div>

    const buttonStyle = { width : `${width}px` };

    return (
      <div className={`mobile-navigation ${this.state.collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="tab-indicator">
          <div className="active-tab" style={{ width : `${tabWidth}px`, marginLeft : `${marginLeft}px` }}/>
        </div>
        <div className={`ripple btn ${activePanelIndex === 0 && searchMode === 'location' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('location')}style={buttonStyle}>
          <FontAwesomeIcon icon={faMapMarked} className="icon" />
        </div>
        <div className={`ripple btn track-mode ${activePanelIndex === 0 && searchMode === 'track' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('track')} style={buttonStyle}>
          <FontAwesomeIcon icon={faMapMarker} className="map-marker" />
          <FontAwesomeIcon icon={faList} className="list" />
        </div>
        {window.BackgroundGeolocation && <div className={`ripple btn ${activePanelIndex === 0 && searchMode === 'trackLocator' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('trackLocator')} style={buttonStyle}>
          <FontAwesomeIcon icon={faLocationArrow} className="icon" />
        </div>}
        <div className={`ripple btn ${activePanelIndex === 1 ? 'active' : ''}`} onClick={(e) => app.setActivePanelIndex(1)} style={buttonStyle}>
          <FontAwesomeIcon icon={faBook} className="icon" />
        </div>

      </div>
  	);
  }
}

export default MobileNavigation;
