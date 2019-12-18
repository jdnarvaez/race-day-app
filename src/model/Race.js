import { DateTime } from 'luxon';

class Race {
  constructor(props) {
    Object.assign(this, props);

    if (props.begins_on) {
      this.begins_on = DateTime.fromISO(props.begins_on);
    }

    if (props.ends_on) {
      this.ends_on = DateTime.fromISO(props.ends_on);
    }

    if (props.starttime) {
      this.starttime = DateTime.fromMillis(props.starttime * 1000);
    }

    if (props.stoptime) {
      this.stoptime = DateTime.fromMillis(props.stoptime * 1000);
    }
  }
}

export default Race;
