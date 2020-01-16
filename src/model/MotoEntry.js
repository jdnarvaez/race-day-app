import { uuid } from 'uuidv4';

class MotoEntry {
  constructor(props) {
    this.id = uuid();
    this.name = 'moto 1';
    this.number = '';
    this.notes = '';
    this.finish = '';
    this.award = 'Stamps';
    this.ridersInMoto = '';
    this.laneNumber = '';
    this.transferSpotsAvailable = '';
    this.photos = [];
    Object.assign(this, props);
  }
}

export default MotoEntry;
