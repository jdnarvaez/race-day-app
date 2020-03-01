const TABLE = 'rider';
const COLUMNS = ['id', 'name', 'serial_number', 'bmx_member_id'];

class Rider {
  static all(storage) {
    return storage.all(Rider.TABLE).then(results => results.map(r => new Rider(r)));
  }

  constructor(props) {
    Object.assign(this, props);
  }
}

Rider.TABLE = TABLE;
Rider.COLUMNS = COLUMNS;

export default Rider;
