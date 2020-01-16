import { LatLng } from 'leaflet';

const TABLE = 'venue';
const COLUMNS = ['id', 'name', 'district', 'city', 'state', 'latitude', 'longitude', 'data'];

class Venue {
  static all(storage) {
    return storage.stageVenuesPromise.then(() => {
      return storage.all('venue').then(resultSet => resultSet.map(v => new Venue(v)));
    })
  }

  constructor(props) {
    Object.assign(this, props);
    this.position = new LatLng(props.latitude, props.longitude);
  }

  save = (storage) => {
    return storage.addOrUpdate(Venue.TABLE, this.id,
      COLUMNS.slice(1, COLUMNS.length),
      [this.name, this.district, this.city, this.state, this.latitude, this.longitude, JSON.stringify(this)]
    );
  }
}

Venue.TABLE = TABLE;
Venue.COLUMNS = COLUMNS;

export default Venue;
