import React, { useContext, useState } from 'react';
import { Rnd } from 'react-rnd';

import EventFilter from './EventFilter';
import RaceRow from './RaceRow';

import './RaceList.css';

class RaceList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      maxHeight: innerHeight - 150
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

  render() {
    const { app, raceList, categoryFilterOptions, categoryFilters, regionFilterOptions, regionFilters } = this.props;
    const { maxHeight } = this.state;
    const hasRaces = raceList && raceList.length > 0;

    return (
      <div className={`race-list ${raceList ? 'show' : 'hide'}`}>
        <div className={`header ${!hasRaces ? 'no-events' : '' }`}>
          <div className="title">
            {!hasRaces && <div className="caption">no events found</div>}
            {raceList && raceList.length > 0 && <div className="count">{raceList.length}</div>}
            {raceList && raceList.length === 1 && <div className="caption">event</div>}
            {raceList && raceList.length > 1 && <div className="caption">events</div>}
          </div>
          <div className="close" onClick={(e) => app.closeRaceList()}>&times;</div>
        </div>
        <div className="filters">
          {categoryFilterOptions.map((option) => <EventFilter filter={option} options={categoryFilters} key={option} toggleFilter={app.toggleCategoryFilter} />)}
        </div>
        <div className="region-filters">
          {regionFilterOptions.map((option) => <EventFilter filter={option} options={regionFilters} key={option} toggleFilter={app.toggleRegionFilter} />)}
        </div>
        {raceList && <div className="details" style={{ maxHeight : `${maxHeight}px`}}>
          {raceList.map((race) => <RaceRow app={app} race={race} key={race.id.toString()} />)}
        </div>}
      </div>
  	);
  }
}

export default RaceList;
