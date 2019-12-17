import { LatLng } from 'leaflet';

class Track {
  constructor(props) {
    Object.assign(this, props);
    this.position = new LatLng(props.latitude, props.longitude);
  }
}

export default Track;
