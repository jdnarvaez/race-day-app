import { DateTime, Duration } from 'luxon';
import { uuid } from 'uuidv4';
// import Track from '../model/Track';
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
    localStorage.removeItem('racesRetrieved');
    localStorage.removeItem('tracksRetrieved');
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

          reader.onerror = function(e) {
            reject(JSON.stringify(e));
          }

          reader.readAsText(file)
        }, (error) => {
          reject(JSON.stringify(error));
        })
      }, (error) => {
        reject(JSON.stringify(error));
      })
    })
  }

  getRaceListNative = (tracks, failed) => {
    const racesLastUpdated = localStorage.getItem('racesRetrieved');

    if (racesLastUpdated === null || (new Date().getTime() - new Date(parseInt(racesLastUpdated)).getTime()) > (86400000 * 7)) {
      if (this.raceList) {
        return this.raceList;
      }

      this.raceList = new Promise((resolve, reject) => {
        cordovaFetch(`https://www.usabmx.com/mobile/ios/race_list_json2.php`)
        .then((response) => response.json())
        .then((races) => {
          return this.deleteFile('races.json').then(() => {
            return this.writeFile('races.json', races).then(() => {
              localStorage.setItem('racesRetrieved', new Date().getTime().toString());
              return races;
            })
          })
        })
        .then((races) => {
          this.raceList = undefined;
          const today = DateTime.fromJSDate(new Date()).minus(Duration.fromObject({ 'days' : 4 }));

          resolve(races.map((race) => new Race(race, tracks)).filter((race) => race.ends_on >= today).sort((a, b) => {
            if (a.begins_on < b.begins_on) {
              return -1
            } else if (a.begins_on > b.begins_on) {
              return 1;
            }

            return 0;
          }))
        })
        .catch((error) => {
          // Fall back to cached race list
          console.error(error);
          console.warn('Using cached data from app bundle');

          import(/* webpackChunkName: "events" */ './events.json').then(eventsModule => {
            const today = DateTime.fromJSDate(new Date()).minus(Duration.fromObject({ 'days' : 4 }));

            resolve(Object.values(eventsModule).filter(t => !Array.isArray(t)).map((race) => new Race(race, tracks)).filter((race) => race.ends_on >= today).sort((a, b) => {
              if (a.begins_on < b.begins_on) {
                return -1
              } else if (a.begins_on > b.begins_on) {
                return 1;
              }

              return 0;
            }))
          }).catch(error => {
            reject(error);
          })
        })
      })

      return this.raceList;
    } else {
      return this.readFile('races.json').then((races) => {
        const today = DateTime.fromJSDate(new Date()).minus(Duration.fromObject({ 'days' : 4 }));

        return races.map((race) => new Race(race, tracks)).filter((race) => race.ends_on >= today).sort((a, b) => {
          if (a.begins_on < b.begins_on) {
            return -1
          } else if (a.begins_on > b.begins_on) {
            return 1;
          }

          return 0;
        })
      }).catch((error) => {
        localStorage.removeItem('racesRetrieved');
        console.error(error);
        return this.getRaceListNative(tracks);
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
      .then(() => {
        localStorage.setItem('tracksRetrieved', new Date().getTime().toString())
        resolve(results);
      })
      .catch((err) => { console.error(err); reject(err) })

      this.trackList = undefined;
    }
  }

  getTrackListNative = () => {
    const tracksLastUpdated = localStorage.getItem('tracksRetrieved');

    if (tracksLastUpdated === null || (new Date().getTime() - new Date(parseInt(tracksLastUpdated)).getTime()) > (86400000 * 7)) {
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
      }).catch((error) => {
        console.error(error);
        localStorage.removeItem('tracksRetrieved');
        return this.getTrackListNative();
      })
    }
  }

  getRaceList = (tracks) => {
    if (this.isApp) {
      return this.getRaceListNative(tracks)
    }

    if (this.raceList) {
      return this.raceList;
    }

    const today = DateTime.fromJSDate(new Date()).minus(Duration.fromObject({ 'days' : 4 }));

    this.raceList =
    fetch(`/race-day-app/data/races.json`, { method : 'GET' })
    .then((response) => response.json())
    .then((response) => response.map((race) => new Race(race, tracks)))
    .then((races) => races.filter((race) => race.ends_on >= today))
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

  getRacesByTracks = (tracks) => {
    const tracknames = tracks.map(track => track.name);
    return this.getRaceList(tracks).then((races) => races.filter(race => tracknames.indexOf(race.trackname) >= 0))
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

  getRiderInfoBySerial = (serial) => {
    const url = `https://www.usabmx.com/mobile/ios/addracermemberlookup.php?serialnumber=${serial}`;
    return cordovaFetch(url).then(response => response.json());
  }

  getRacerDetailsByMemberId = (memberId) => {
    const url = `https://www.usabmx.com/mobile/ios/racer_detail_json.php?memberid=${memberId}`;
    return cordovaFetch(url).then(response => response.json());
  }
}

export default new USABMX();
