import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faWindowMinimize, faTimes, faSync, faLocationArrow } from '@fortawesome/free-solid-svg-icons';

import EventFilter from './EventFilter';
import RaceRow from './RaceRow';

import './RaceList.css';

const ROW_HEIGHT = 150;

class RaceList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      maxHeight: innerHeight - 150,
      minimized: true,
      isApp : window.cordova !== undefined,
      width: isMobile ? innerWidth - 50 : 375
    }
  }

  onOrientationChange = (e) => {
    this.setState({ width : innerWidth - 50, maxHeight : innerHeight - 150 })
  }

  onWindowResize = () => {
    this.setState({ maxHeight : innerHeight - 150 })
  }

  componentDidMount() {
    if (isMobile) {
      window.addEventListener('orientationchange', this.onOrientationChange);
    } else {
      window.addEventListener('resize', this.onWindowResize);
    }
  }

  componentWillUnmount() {
    if (isMobile) {
      window.removeEventListener('orientationchange', this.onOrientationChange);
    } else {
      window.removeEventListener('resize', this.onWindowResize);
    }
  }

  renderRow = ({ index, key, style }) => {
    const { app, raceList, tracks } = this.props;
    const race = raceList[index];
    return (<div className="race-row-container" style={style} key={race.id}><RaceRow app={app} race={race} tracks={tracks} /></div>);
  }

  render() {
    const { renderRow } = this;
    const { app, raceList, categoryFilterOptions, categoryFilters, regionFilterOptions, regionFilters, activeTrack, moveMapToCurrentLocation } = this.props;
    const { maxHeight, minimized, isApp, width } = this.state;
    const hasRaces = raceList && raceList.length > 0;
    const style = {};

    if (isMobile) {
      style.width = `${width}px`

      if (activeTrack) {
        if (isApp) {
          style.top = `210px`;
        } else {
          style.top = `200px`;
        }
      } else if (isApp) {
        style.top = `35px`;
      }
    }

    var listHeight = 0;

    if (isMobile) {
      if (raceList) {
        if (!minimized) {
          var maxListHeight = activeTrack ? innerHeight - 445 : innerHeight - 270;

          if (isApp) {
            maxListHeight -= 10;
          }

          listHeight = raceList ? Math.min(maxListHeight, raceList.length * ROW_HEIGHT) : 0;
        }
      }
    } else {
      listHeight = raceList ? Math.min(maxHeight, raceList.length * ROW_HEIGHT - 10) : 0
    }

    return (
      <div className={`race-list ${raceList ? 'show' : 'hide'} ${this.props.searchMode}`} style={style}>
        <div className={`header ${!hasRaces ? 'no-events' : '' }`}>
          <div className="title">
            {!hasRaces && <div className="caption">no events found</div>}
            {raceList && raceList.length > 0 && <div className="count">{raceList.length}</div>}
            {raceList && raceList.length === 1 && <div className="caption">event</div>}
            {raceList && raceList.length > 1 && <div className="caption">events</div>}
          </div>
          <div className="current-location" onClick={moveMapToCurrentLocation}>
            <FontAwesomeIcon icon={faLocationArrow} />
          </div>
          {isMobile && minimized && <div className="maximize" onClick={(e) => this.setState({ minimized : false })}>
            <FontAwesomeIcon icon={faWindowMaximize} />
          </div>}
          {isMobile && !minimized && <div className="minimize" onClick={(e) => this.setState({ minimized : true })}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </div>}
          <div className="refresh" onClick={(e) => app.refreshData()}>
            <FontAwesomeIcon icon={faSync} />
          </div>
          <div className="close" onClick={(e) => app.closeRaceList()}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="filters">
          {categoryFilterOptions.map((option) => <EventFilter filter={option} options={categoryFilters} key={option} toggleFilter={app.toggleCategoryFilter} />)}
        </div>
        <div className="region-filters">
          {regionFilterOptions.map((option) => <EventFilter filter={option} options={regionFilters} key={option} toggleFilter={app.toggleRegionFilter} />)}
        </div>
        <List
          className="race-row-list"
          height={listHeight}
          itemCount={raceList ? raceList.length : 0}
          itemSize={ROW_HEIGHT - 10}
          width={width}
        >
          {renderRow}
        </List>
      </div>
  	);
  }
}

export default RaceList;
