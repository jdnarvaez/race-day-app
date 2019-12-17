const request = require('request');
const fs = require('fs');
const path = require('path');

// Retrieve Races
console.log('Retrieving races...');

request('http://www.usabmx.com/mobile/ios/race_list_json2.php', { json : true }, (err, res, body) => {
  if (err) { return console.log(err); }
  fs.writeFileSync(path.resolve(path.join(__dirname, '..', 'docs', 'data', 'races.json')), JSON.stringify(body));
});

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
    const tracks = [];

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
