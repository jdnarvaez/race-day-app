import { DateTime, Duration  } from 'luxon';

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
      this.starttime = DateTime.fromMillis(props.starttime * 1000).minus(Duration.fromMillis(3600000));
    }

    if (props.stoptime) {
      this.stoptime = DateTime.fromMillis(props.stoptime * 1000).minus(Duration.fromMillis(3600000));
    }

    if (this.trackname === 'Tri-City BMX' && this.category === 'Practice') {
      // Track operator indicated the practice time is incorrect, even though it comes back from USABMX as 6pm.
      this.starttime = this.starttime.minus(Duration.fromMillis(1800000));
      this.stoptime = this.starttime.minus(Duration.fromMillis(1800000));
    }
  }
}

export default Race;
