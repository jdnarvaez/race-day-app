import { DateTime } from 'luxon';
import { uuid } from 'uuidv4';
import Track from '../model/Track';
import Race from '../model/Race';

class USABMX {
  constructor() {
    this.isApp = window.cordova !== undefined;

    this.unlistedTracks = [
      {
        'id': uuid(),
        'name': 'South Point Hotel & Casino',
        'district': 'NAT',
        'city': 'Las Vegas',
        'state': 'NV',
        'latitude': '36.0115768',
        'longitude': '-115.1745167'
      },
      {
        'id': uuid(),
        'name': 'South Point Event Center',
        'district': 'NAT',
        'city': 'Las Vegas',
        'state': 'NV',
        'latitude': '36.0115768',
        'longitude': '-115.1745167'
      },
      {
        'id': uuid(),
        'name': 'Virginia Horse Center',
        'district': 'NAT',
        'city': 'Lexington',
        'state': 'VA',
        'latitude': '37.8103699',
        'longitude': '-79.4287132'
      },
      {
        'id': uuid(),
        'name': 'Ford Truck Arena',
        'district': 'NAT',
        'city': 'Tulsa',
        'state': 'OK',
        'latitude': '36.1371867',
        'longitude': '-95.9303944'
      },
      {
        'id': uuid(),
        'name': 'Bank of Cascades Center',
        'district': 'NAT',
        'city': 'Redmond',
        'state': 'OR',
        'latitude': '44.2381174',
        'longitude': '-121.1853418'
      },
      {
        'id': uuid(),
        'name': 'Ike Hamilton Expo Center',
        'district': 'NAT',
        'city': 'West Monroe',
        'state': 'LA',
        'latitude': '32.5055535',
        'longitude': '-92.1832627'
      },
      {
        'id': uuid(),
        'name': 'Heritage Park',
        'district': 'NAT',
        'city': 'Chilliwack',
        'state': 'BC',
        'latitude': '49.1415924',
        'longitude': '-122.005913'
      },
      {
        'id': uuid(),
        'name': 'River Spirit Expo',
        'district': 'NAT',
        'city': 'Tulsa',
        'state': 'OK',
        'latitude': '36.1347291',
        'longitude': '-95.9330429'
      }
    ]
  }

  markDirty = () => {
    this.raceList = undefined;
    this.trackList = undefined;
    localStorage.removeItem('racesLastUpdated');
    localStorage.removeItem('tracksLastUpdated');
  }

  deleteFile = (file) => {
    return new Promise((resolve, reject) => {
      resolveLocalFileSystemURL(cordova.file.syncedDataDirectory || cordova.file.dataDirectory, (dir) => {
        dir.getFile(file, { create : false }, (fileEntry) => {
          fileEntry.remove(() => {
            resolve()
          },(error) => {
            console.error(error);
            reject(error)
          },() => {
            resolve()
          });
        }, () => resolve());
      });
    })
  }

  writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
      resolveLocalFileSystemURL(cordova.file.syncedDataDirectory || cordova.file.dataDirectory, (directoryEntry) => {
        directoryEntry.getFile(file, { create : true }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.onwriteend = function(e) {
                resolve();
              }

              fileWriter.onerror = function(e) {
                console.error(e);
                reject(e);
              }

              const blob = new Blob([JSON.stringify(data, null, '\t')], { type : 'text/plain' })
              fileWriter.write(blob)
            }, (error) => {
              console.error(error);
              reject(error);
            })
          }, (error) => {
            console.error(error);
            reject(error);
          }
        )
      }, (error) => {
        console.error(error);
        reject(error);
      })
    })
  }

  readFile = (file) => {
    return new Promise((resolve, reject) => {
      resolveLocalFileSystemURL(`${cordova.file.syncedDataDirectory || cordova.file.dataDirectory}${file}`, (fileEntry) => {
        fileEntry.file((file) => {
          const reader = new FileReader();

          reader.onloadend = function(e) {
            resolve(JSON.parse(this.result))
          }

          reader.readAsText(file)
        }, (error) => {
          console.error(error);
          reject(error);
        })
      }, (error) => {
        console.error(error);
        reject(error);
      })
    })
  }

  getRaceListNative = () => {
    const racesLastUpdated = localStorage.getItem('racesLastUpdated');

    if (racesLastUpdated === null || (new Date().getTime() - new Date(parseInt(racesLastUpdated)).getTime()) > 86400000) {
      localStorage.setItem('racesLastUpdated', new Date().getTime().toString())

      if (this.raceList) {
        return this.raceList;
      }

      this.raceList = new Promise((resolve, reject) => {
        cordovaFetch(`https://www.usabmx.com/mobile/ios/race_list_json2.php`)
        .then((response) => response.json())
        .then((races) => {
          return this.deleteFile('races.json').then(() => {
            return this.writeFile('races.json', races)
          })
          .then(() => {
            this.raceList = undefined;
            const today = DateTime.fromJSDate(new Date());

            resolve(races.map((race) => new Race(race)).filter((race) => race.begins_on >= today).sort((a, b) => {
              if (a.begins_on < b.begins_on) {
                return -1
              } else if (a.begins_on > b.begins_on) {
                return 1;
              }

              return 0;
            }))
          })
          .catch((err) => console.error(err))
        })
      })

      return this.raceList;
    } else {
      return this.readFile('races.json').then((races) => {
        const today = DateTime.fromJSDate(new Date());

        return races.map((race) => new Race(race)).filter((race) => race.begins_on >= today).sort((a, b) => {
          if (a.begins_on < b.begins_on) {
            return -1
          } else if (a.begins_on > b.begins_on) {
            return 1;
          }

          return 0;
        })
      })
    }
  }

  getTracksForStateNative = (state) => {
    return cordovaFetch(`https://www.usabmx.com/mobile/ios/track_list_jsonv2.php?state=${state}`).then((response) => response.json())
  }

  fetchTracksNative = (tracks, codes, resolve, reject) => {
    const code = codes.shift();

    if (code) {
      this.getTracksForStateNative(code).then((results) => {
        results.forEach((result) => {
          tracks.push(new Track(result))
        });

        this.fetchTracksNative(tracks, codes, resolve, reject);
      })
      .catch((error) => reject(error));
    } else {
      const results = tracks.filter((track) => {
        if (track.latitude === null || track.longitude === null) {
          console.warn('Track with invalid location', track);
          return false;
        }

        return true;
      })

      this.deleteFile('tracks.json').then(() => {
        return this.writeFile('tracks.json', results)
      })
      .then(() => resolve(results))
      .catch((err) => { console.error(err); reject(err) })

      this.trackList = undefined;
    }
  }

  getTrackListNative = () => {
    const tracksLastUpdated = localStorage.getItem('tracksLastUpdated');

    if (tracksLastUpdated === null || (new Date().getTime() - new Date(parseInt(tracksLastUpdated)).getTime()) > 86400000) {
      localStorage.setItem('tracksLastUpdated', new Date().getTime().toString())

      if (this.trackList) {
        return this.trackList;
      }

      this.trackList = new Promise((resolve, reject) => {
        const tracks = [];

        cordovaFetch(`https://www.usabmx.com/mobile/ios/track_list_dropdown.php`)
        .then((response) => response.json())
        .then((states) => {
          const codes = states.filter((state) => state.name !== '').map((state) => state.code);
          this.fetchTracksNative(tracks, codes, resolve, reject);
        })
      })

      return this.trackList;
    } else {
      return this.readFile('tracks.json').then((tracks) => {
        return tracks.concat(this.unlistedTracks).filter((track) => {
          if (track.latitude === null || track.longitude === null) {
            console.warn('Track with invalid location', JSON.stringify(track));
            return false;
          }

          return true;
        })
        .map((track) => new Track(track))
      })
    }
  }

  getRaceList = () => {
    if (this.isApp) {
      return this.getRaceListNative()
    }

    if (this.raceList) {
      return this.raceList;
    }

    const today = DateTime.fromJSDate(new Date());

    this.raceList =
    fetch(`/race-day-app/data/races.json`, { method : 'GET' })
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
  }

  getRacesByTrack = (track) => {
    return this.getRaceList().then((races) => races.filter(race => race.trackname === track.name))
  }

  getRacesByTracks = (tracks) => {
    return this.getRaceList().then((races) => races.filter(race => tracks.indexOf(race.trackname) >= 0))
  }

  getTrackList = () => {
    if (this.isApp) {
      return this.getTrackListNative()
    }

    if (this.trackList) {
      return this.trackList;
    }

    this.trackList =
    fetch(`/race-day-app/data/tracks.json`, { method : 'GET' })
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
    .then((tracks) => tracks.concat(this.unlistedTracks).map((track) => new Track(track)))

    return this.trackList;
  }
}

export default new USABMX();
