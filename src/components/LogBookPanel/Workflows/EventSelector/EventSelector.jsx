import React from 'react';
import { DateTime, Duration } from 'luxon';
import { LatLng } from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faPlus } from '@fortawesome/free-solid-svg-icons';
import USABMX from '../../../../services/USABMX';

import './EventSelector.css';

class EventSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events : []
    }
  }

  componentDidMount() {
    const { updateEventList } = this;
    updateEventList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateEventList } = this;

    if (prevProps.venue !== this.props.venue) {
      updateEventList();
    }
  }

  updateEventList = () => {
    const { venue } = this.props;

    if (venue) {
      USABMX.getRacesByTracks([venue]).then((raceList) => {
        const limit = DateTime.fromMillis(new Date().getTime()).plus(Duration.fromObject({ days : 3 }));
        this.setState({ events : raceList.filter(race => race.begins_on < limit) });
      })
    }
  }

  selectEvent = (e, event) => {
    const { logBookEntry, onSelect } = this.props;
    logBookEntry.event = event;

    if (event.eventName && event.eventName() === 'Practice') {
      logBookEntry.category = 'Practice';
    }

    onSelect(e, logBookEntry);
  }

  render() {
    const { selectEvent } = this;
    const { app, width, height, logBookEntry, onSelect } = this.props;
    const { events } = this.state;

    return (
      <div className={`event-selector`} style={{ height : `${height}px` }}>
        <div className="events" style={{ height : `${height - 50}px` }}>
          {events.length === 0 &&
            <div className={`event no-events-found`} key={'no-events-found'} onClick={onSelect}>
              <div className="name">no events found</div>
            </div>
          }
          {events.map(event => {
            return (
              <div className={`event ripple ${event.id === logBookEntry.event.id ? 'selected' : ''}`} key={event.id.toString()} onClick={(e) => selectEvent(e, event)}>
                <div className="name">{event.eventName()}</div>
                <div className="date">{event.begins_on.toLocaleString(DateTime.DATE_FULL)}</div>
              </div>
            )
          })}
        </div>
      </div>
  	);
  }
}

export default EventSelector;
