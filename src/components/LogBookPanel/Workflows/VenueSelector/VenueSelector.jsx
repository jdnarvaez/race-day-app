import React from 'react';
import { DateTime, Duration } from 'luxon';
import { LatLng } from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faPlus } from '@fortawesome/free-solid-svg-icons';

import Venue from '../../../../model/Venue';
import './VenueSelector.css';

class VenueSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venues : []
    }
  }

  componentDidMount() {
    const { storage } = this.props;
    
    Venue.all(storage).then(venues => {
      if (window.cordova) {
        BackgroundGeolocation.getCurrentLocation(position => {
          const location = new LatLng(position.latitude, position.longitude);
          const nearbyVenues = venues.filter(venue => venue.position.distanceTo(location) <= 160934); // 100 miles
          this.setState({ venues : nearbyVenues });
        }, err => console.error(err));
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          const location = new LatLng(position.coords.latitude, position.coords.longitude);
          const nearbyVenues = venues.filter(venue => venue.position.distanceTo(location) <= 160934); // 100 miles
          this.setState({ venues : nearbyVenues });
        }, err => console.error(err));
      }
    })
  }

  selectVenue = (e, venue) => {
    const { logBookEntry, onSelect } = this.props;
    logBookEntry.venue = venue;
    onSelect(e, logBookEntry);
  }

  render() {
    const { selectVenue } = this;
    const { app, width, height, logBookEntry, onSelect } = this.props;
    const { venues } = this.state;

    return (
      <div className={`venue-selector`} style={{ height : `${height}px` }}>
        <div className="venues" style={{ height : `${height - 50}px` }}>
          {venues.length === 0 &&
            <div className={`venue no-venues-found`} key={'no-venues-found'} onClick={onSelect}>
              <div className="name">no venues found nearby</div>
            </div>
          }
          {venues.map(venue => {
            return (
              <div className={`venue ripple ${venue.id === logBookEntry.venue.id ? 'selected' : ''}`} key={venue.id.toString()} onClick={(e) => selectVenue(e, venue)}>
                <div className="name">{venue.name}</div>
                <div className="location">{`${venue.city}, ${venue.state}`}</div>
              </div>
            )
          })}
        </div>
      </div>
  	);
  }
}

export default VenueSelector;
