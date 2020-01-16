import { DateTime, Duration  } from 'luxon';
import tzlookup from 'tz-lookup';

class Race {
  constructor(props, tracks) {
    Object.assign(this, props);

    const track = tracks.find(t => t.name === props.trackname);
    const opts = {};

    if (track) {
      try {
        const zone = tzlookup(track.latitude, track.longitude);
        opts.zone = zone;
      } catch (err) {
        console.error(err);
      }
    }

    if (props.begins_on) {
      this.begins_on = DateTime.fromISO(props.begins_on, opts);
    }

    if (props.ends_on) {
      this.ends_on = DateTime.fromISO(props.ends_on, opts);
    }

    if (props.starttime) {
      this.starttime = DateTime.fromMillis(props.starttime * 1000, opts).minus(Duration.fromMillis(3600000));
    }

    if (props.stoptime) {
      this.stoptime = DateTime.fromMillis(props.stoptime * 1000, opts).minus(Duration.fromMillis(3600000));
    }

    if (this.trackname === 'Tri-City BMX' && this.category === 'Practice') {
      // Track operator indicated the practice time is incorrect, even though it comes back from USABMX as 6pm.
      this.starttime = this.starttime.minus(Duration.fromMillis(1800000));
      this.stoptime = this.starttime.minus(Duration.fromMillis(1800000));
    }
  }

  eventName = () => {
    var raceName = this.name;

    if (!raceName || raceName === '') {
      if (this.category === 'Practice') {
        raceName = this.category
      } else {
        if (this.series && this.series !== '') {
          raceName = `${this.region} ${this.series}`;
        } else {
          raceName = `${this.region} ${this.category}`;
        }
      }
    }

    return raceName
  }
}

export default Race;
