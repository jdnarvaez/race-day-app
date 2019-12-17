import { DateTime } from 'luxon';
import Track from '../model/Track';
import Race from '../model/Race';

class USABMX {
  constructor() {

  }

  getRaceList = () => {
    if (this.raceList) {
      return this.raceList;
    }

    const today = DateTime.fromJSDate(new Date());

    this.raceList =
    fetch(`/docs/data/races.json`, { method : 'GET' })
    .then((response) => response.json())
    .then((response) => response.map((race) => new Race(race)))
    .then((races) => races.filter((race) => race.begins_on >= today))
    .then((races) => {
      return races.sort((a, b) => {
        if (a.begins_on < b.begins_on) {
          return -1
        } else if (a.begins_on > b.begins_on) {
          return 1;
        }

        return 0;
      })
    })

    return this.raceList;

    // https://crossorigin.me
    // https://cors-anywhere.herokuapp.com
    // return fetch(`https://cors-anywhere.herokuapp.com/http://www.usabmx.com/mobile/ios/race_list_json2.php`, {
    //   method : 'GET'
    // })
    // .then((response) => response.json())
    // .then((response) => response.map((race) => new Race(race)))
    // .then((races) => {
    //   return races.sort((a, b) => {
    //     if (a.begins_on < b.begins_on) {
    //       return -1
    //     } else if (a.begins_on > b.begins_on) {
    //       return 1;
    //     }
    //
    //     return 0;
    //   })
    // })
  }

  getRacesByTrack = (track) => {
    return this.getRaceList().then((races) => races.filter(race => race.trackname === track.name))
  }

  getRacesByTracks = (tracks) => {
    return this.getRaceList().then((races) => races.filter(race => tracks.indexOf(race.trackname) >= 0))
  }

  getTracksForState = (state) => {
    return fetch(`https://cors-anywhere.herokuapp.com/http://www.usabmx.com/mobile/ios/track_list_jsonv2.php?state=${state}`, { method : 'GET' }).then((response) => response.json())
  }

  fetchTracks = (tracks, codes, resolve, reject) => {
    const code = codes.shift();

    if (code) {
      this.getTracksForState(code).then((results) => {
        results.forEach((result) => {
          tracks.push(new Track(result))
        });
        this.fetchTracks(tracks, codes, resolve, reject);
      })
      .catch((error) => reject(error));
    } else {
      resolve(tracks);
    }
  }

  getTrackList = () => {
    if (this.trackList) {
      return this.trackList;
    }

    this.trackList =
    fetch(`/docs/data/tracks.json`, { method : 'GET' })
    .then((response) => response.json())
    .then((tracks) => {
      return tracks.filter((track) => {
        if (track.latitude === null || track.longitude === null) {
          console.warn('Track with invalid location', track);
          return false;
        }

        return true;
      })
    })
    .then((tracks) => tracks.map((track) => new Track(track)))

    return this.trackList;

    // return new Promise((resolve, reject) => {
    //   const tracks = [];
    //
    //   fetch(`https://cors-anywhere.herokuapp.com/http://www.usabmx.com/mobile/ios/track_list_dropdown.php`, {
    //     method : 'GET'
    //   })
    //   .then((response) => response.json())
    //   .then((states) => {
    //     const codes = states.filter((state) => state.name !== '').map((state) => state.code);
    //     this.fetchTracks(tracks, codes, resolve, reject);
    //   })
    // })
  }
}

export default new USABMX();
