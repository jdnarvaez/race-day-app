import { uuid } from 'uuidv4';

class RiderEntry {
  constructor(props) {
    this.id = uuid();
    this.rider = {};
    this.ageGroup = undefined;
    this.motos = [];
    this.notes = '';
    this.photos = [];
    Object.assign(this, props);
  }
}

export default RiderEntry;
