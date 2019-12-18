import React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { uuid } from 'uuidv4';

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

  raceName = (race) => {
    var raceName = race.name;

    if (!raceName || raceName === '') {
      if (race.category === 'Practice') {
        raceName = race.category
      } else {
        raceName = `${race.region} ${race.category}`;
      }
    }

    return raceName
  }

  addToCalendar = () => {
    const { tracks, race } = this.props;
    const raceName = this.raceName(race);
    const track = tracks.find((track) => track.name === race.trackname);
    const description = track ? [track.name, track.email, track.website_url].filter((prop) => !!prop).join(' ') : race.trackname;

    const href = ([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'URL:' + document.URL,
      'UID:' + uuid(),
      'DTSTAMP:' + DateTime.fromJSDate(new Date).toISO().replace(/-|:|\.\d+/g, '').split('T')[0],
      'DTSTART:' + race.begins_on.toISO().replace(/-|:|\.\d+/g, '').split('T')[0],
      'DTEND:' + race.ends_on.toISO().replace(/-|:|\.\d+/g, '').split('T')[0],
      'SUMMARY:' + raceName,
      'DESCRIPTION:' + description,
      'LOCATION:' + race.trackname,
      'END:VEVENT',
      'END:VCALENDAR'].join('\n'));

    let blob = new Blob([href], { type : 'text/calendar' })
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${raceName}.ics`;
    link.click();
    link.remove();
  }

  render() {
    const { addToCalendar } = this;
    const { app, race } = this.props;
    const raceName = this.raceName(race);

    return (
      <div className={`race-row ${race.category.replace(' ', '')} ${race.series.replace(' ', '')}` } key={race.id.toString()} style={this.props.style}>
        <div className="identifier">&nbsp;</div>
        <div className="content">
          <div className="region-container"><div className="region">{this.mapRegion(race.region)}</div></div>
          <div className="details">
            <div className="racename">{raceName}</div>
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
          <div className="add-to-calendar" onClick={addToCalendar}>
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        </div>
      </div>
  	);
  }
}

export default RaceList;
