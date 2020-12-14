import React from 'react';
import { LatLng } from 'leaflet';

import { Input } from '../../../Input';
import Venue from '../../../../model/Venue';
import './VenueSelector.css';

class VenueSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venueName : '',
      venues : [],
      nearbyVenues : []
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activePanel !== this.props.activePanel) {
      this.setState({ venueName : '' });
    }
  }

  componentDidMount() {
    const { storage } = this.props;

    Venue.all(storage).then(venues => {
      this.setState({ allVenues : venues }, () => {
        if (window.cordova) {
          BackgroundGeolocation.getCurrentLocation(position => {
            const location = new LatLng(position.latitude, position.longitude);
            const nearbyVenues = venues.filter(venue => venue.position.distanceTo(location) <= 160934); // 100 miles
            this.setState({ venues : nearbyVenues, nearbyVenues : nearbyVenues });
          }, err => console.error(err));
        } else {
          navigator.geolocation.getCurrentPosition((position) => {
            const location = new LatLng(position.coords.latitude, position.coords.longitude);
            const nearbyVenues = venues.filter(venue => venue.position.distanceTo(location) <= 160934); // 100 miles
            this.setState({ venues : nearbyVenues, nearbyVenues : nearbyVenues });
          }, err => console.error(err));
        }
      })
    })
  }

  selectVenue = (e, venue) => {
    const { logBookEntry, onSelect } = this.props;
    logBookEntry.venue = venue;
    onSelect(e, logBookEntry);
  }

  onChange = (event) => {
    const name = event.target.value.toLowerCase().trim();

    this.setState({ venueName : name }, () => {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        const { nearbyVenues, allVenues } = this.state;

        if (name === '') {
          return this.setState({ venues : nearbyVenues });
        }

        const foundVenues = allVenues.filter(venue => venue.name && venue.name.toLowerCase().indexOf(name) > -1).sort((a , b) => {
          const textA = a.name.toUpperCase();
          const textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        this.setState({ venues : foundVenues });
      }, 50);
    })


  }

  render() {
    const { selectVenue, onChange } = this;
    const { app, width, height, logBookEntry, onSelect } = this.props;
    const { venues } = this.state;

    return (
      <div className={`venue-selector`} style={{ height : `${height}px` }}>
        <div className="header">
          <div className="name-input">
            <Input
              label="Search All Venues"
              locked={false}
              active={false}
              type="text"
              onChange={onChange}
              value={this.state.venueName}
            />
          </div>
        </div>
        <div className="venues" style={{ height : `${height - 50 - 45}px` }}>
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
