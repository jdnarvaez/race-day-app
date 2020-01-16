const request = require('request');
const fs = require('fs');
const path = require('path');
const { uuid } = require('uuidv4');

// Retrieve Tracks
function getTracksForState(state) {
  console.log(`Retrieving tracks for ${state}...`);

  return new Promise((resolve, reject) => {
    request(`http://www.usabmx.com/mobile/ios/track_list_jsonv2.php?state=${state}`, { json : true }, (err, res, body) => {
      if (err) {
        return reject(error);
      }

      resolve(body);
    });
  })
}

function fetchTracks(tracks, codes, resolve, reject) {
  const code = codes.shift();

  if (code) {
    getTracksForState(code).then((results) => {
      results.forEach((result) => {
        tracks.push(result)
      });

      fetchTracks(tracks, codes, resolve, reject);
    })
    .catch((error) => reject(error));
  } else {
    resolve(tracks);
  }
}

function getStates() {
  return new Promise((resolve, reject) => {
    console.log('Retrieving list of states...');

    request('http://www.usabmx.com/mobile/ios/track_list_dropdown.php', { json : true }, (err, res, body) => {
      if (err) {
        return reject(error);
      }

      resolve(body);
    });
  })
}

function getTrackList() {
  return new Promise((resolve, reject) => {
    const tracks = [
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

    getStates()
    .then((states) => {
      const codes = states.filter((state) => state.name !== '').map((state) => state.code);
      fetchTracks(tracks, codes, resolve, reject);
    })
  })
}

getTrackList().then((tracks) => {
  fs.writeFileSync(path.resolve(path.join(__dirname, '..', 'docs', 'data', 'tracks.json')), JSON.stringify(tracks));
})
.catch((err) => {
  console.error(err);
})
