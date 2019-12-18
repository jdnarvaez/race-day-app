import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMapMarker, faMapMarked } from '@fortawesome/free-solid-svg-icons';

import './MobileNavigation.css';

class MobileNavigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    }
  }

  render() {
    const { app, searchMode } = this.props;
    const { width } = this.state;

    return (
      <div className={`mobile-navigation ${this.state.collapsed ? 'collapsed' : 'expanded'}`}>
        <div className={`ripple btn ${searchMode === 'location' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('location')} alt="">
          <FontAwesomeIcon icon={faMapMarked} className="icon" />
        </div>
        <div className={`ripple btn ${searchMode === 'currentLocation' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('currentLocation')}>
          <FontAwesomeIcon icon={faLocationArrow} className="icon" />
        </div>
        <div className={`ripple btn ${searchMode === 'track' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('track')}>
          <FontAwesomeIcon icon={faMapMarker} className="icon" />
        </div>
        <div className="app-logo">race day</div>
      </div>
  	);
  }
}

export default MobileNavigation;
