import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { isMobileOnly } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faWindowMinimize, faTimes } from '@fortawesome/free-solid-svg-icons';

import EventFilter from './EventFilter';
import RaceRow from './RaceRow';

import './RaceList.css';

const ROW_HEIGHT = 150;

class RaceList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      maxHeight: innerHeight - 150,
      minimized: true
    }
  }

  onWindowResize = () => {
    this.setState({ maxHeight : innerHeight - 150 })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
  }

  renderRow = ({ index, key, style }) => {
    const { app, raceList, tracks } = this.props;
    const race = raceList[index];
    return (<div className="race-row-container" style={style}><RaceRow app={app} race={race} tracks={tracks} key={race.id.toString()} /></div>);
  }

  render() {
    const { renderRow } = this;
    const { app, raceList, categoryFilterOptions, categoryFilters, regionFilterOptions, regionFilters, activeTrack } = this.props;
    const { maxHeight, minimized } = this.state;
    const hasRaces = raceList && raceList.length > 0;
    const style = {};

    if (isMobileOnly) {
      style.width = `${innerWidth - 50}px`

      if (activeTrack) {
        style.top = `200px`;
      }
    }

    var listHeight = 0;

    if (isMobileOnly) {
      if (raceList) {
        if (!minimized) {
          const maxListHeight = activeTrack ? innerHeight - 445 : innerHeight - 270;
          listHeight = raceList ? Math.min(maxListHeight, raceList.length * ROW_HEIGHT) : 0;
        }
      }
    } else {
      listHeight = raceList ? Math.min(maxHeight, raceList.length * ROW_HEIGHT - 10) : 0
    }

    return (
      <div className={`race-list ${raceList ? 'show' : 'hide'}`} style={style}>
        <div className={`header ${!hasRaces ? 'no-events' : '' }`}>
          <div className="title">
            {!hasRaces && <div className="caption">no events found</div>}
            {raceList && raceList.length > 0 && <div className="count">{raceList.length}</div>}
            {raceList && raceList.length === 1 && <div className="caption">event</div>}
            {raceList && raceList.length > 1 && <div className="caption">events</div>}
          </div>
          {isMobileOnly && minimized && <div className="maximize" onClick={(e) => this.setState({ minimized : false })}>
            <FontAwesomeIcon icon={faWindowMaximize} />
          </div>}
          {isMobileOnly && !minimized && <div className="minimize" onClick={(e) => this.setState({ minimized : true })}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </div>}
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
          width={isMobileOnly ? (innerWidth - 50) : 375}
        >
          {renderRow}
        </List>
      </div>
  	);
  }
}

export default RaceList;
