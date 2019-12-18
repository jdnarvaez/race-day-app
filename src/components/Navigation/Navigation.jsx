import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMapMarker, faMapMarked } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';

import './Navigation.css';

class Navigation extends React.PureComponent {
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
      <div className={`navigation ${this.state.collapsed ? 'collapsed' : 'expanded'}`}>
        <Tooltip mouseEnterDelay={.5} mouseLeaveDelay={.5} placement="right" trigger={['hover']} overlay={<span>Search by Track Location</span>}>
          <div className={`ripple btn ${searchMode === 'location' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('location')} alt="">
            <FontAwesomeIcon icon={faMapMarked} className="icon" />
          </div>
        </Tooltip>
        <Tooltip mouseEnterDelay={.5} mouseLeaveDelay={.5} placement="right" trigger={['hover']} overlay={<span>Search by Current Location</span>}>
          <div className={`ripple btn ${searchMode === 'currentLocation' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('currentLocation')}>
            <FontAwesomeIcon icon={faLocationArrow} className="icon" />
          </div>
        </Tooltip>
        <Tooltip mouseEnterDelay={.5} mouseLeaveDelay={.5} placement="right" trigger={['hover']} overlay={<span>Search by Track</span>}>
          <div className={`ripple btn ${searchMode === 'track' ? 'active' : ''}`} onClick={(e) => app.setSearchMode('track')}>
            <FontAwesomeIcon icon={faMapMarker} className="icon" />
          </div>
        </Tooltip>
        <div className="app-logo">race day</div>
      </div>
  	);
  }
}

export default Navigation;
