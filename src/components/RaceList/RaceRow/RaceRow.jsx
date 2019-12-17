import React from 'react';
import { DateTime } from 'luxon';
import './RaceRow.css';

class RaceList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  mapRegion(region) {
    switch (region) {
      case 'National':
        return 'NAT';
      case  'South West':
        return 'SW';
      case 'North Central':
        return 'NC';
      case 'South Central':
        return 'SC';
      case 'North West':
        return 'NW';
      case 'North East':
        return 'NE';
      case 'South East':
        return 'SE';
      default:
        return region;
    }
  }

  render() {
    const { app, race } = this.props;

    return (
      <div className={`race-row ${race.category.replace(' ', '')} ${race.series.replace(' ', '')}` } key={race.id.toString()} style={this.props.style}>
        <div className="identifier">&nbsp;</div>
        <div className="content">
          <div className="region-container"><div className="region">{this.mapRegion(race.region)}</div></div>
          <div className="details">
            <div className="date-time">
              <div className="date">{race.begins_on.toLocaleString(DateTime.DATE_FULL)}</div>
              <div className="secondary">
                <div className="day">{race.begins_on.toLocaleString({ weekday : 'long' })}</div>
                <div className="time">{race.starttime.toLocaleString(DateTime.TIME_SIMPLE)}</div>
              </div>
            </div>
            <div className="trackname" onClick={(e) => app.showTrackWithName(race.trackname)}>{race.trackname}</div>
            <div className="location">{`${race.city}, ${race.state}, ${race.country}`}</div>
          </div>
        </div>
      </div>
  	);
  }
}

export default RaceList;
