import { uuid } from 'uuidv4';

import Rider from '../model/Rider';
import Venue from '../model/Venue';
import LogBookEntry from '../model/LogBookEntry';
import USABMX from './USABMX';

// TODO: bulk add on doc parsing. faster to iterate entires, find riders first, then bulk insert the captures.
// Handle rider info error

//
// function getById(table, id, columns) {
//  var columns = columns.join(',');
//  var statement = 'SELECT ' + columns + ' FROM ' + table + ' WHERE id   = ?';
//  return query(statement, [id]).then(function(result) {
//   return fetch(result);
//  });
// };
// function getBulkById(table, idList, columns) {
//  var columns = columns.join(',');
//  idList = idList.map(function(item) {
//   return '"' + item + '"';
//  })
//  var statement = 'SELECT ' + columns + ' FROM ' + table + ' WHERE id IN(' + idList.join(', ') + ')';
//  return query(statement).then(function(result) {
//   return fetchMany(result)
//  })
// };
// function getAll(table, columns, limit, orderBy, orderType) {
//  var columns = columns.join(',');
//  var statement = 'SELECT ' + columns + ' FROM ' + table;
//  if (orderBy) {
//   statement = statement + ' order by ' + orderBy + ' ' + orderType
//  }
//  if (limit) {
//   statement = statement + ' limit ' + limit
//  }
//  return query(statement).then(function(result) {
//   return fetchMany(result)
//  })
// }
// function add(table, columns, values) {
//  var valueString = values.map(function(item) {
//   return '?';
//  }).join(',');
//  var statement = 'INSERT INTO ' + table + '(' + columns.join(',') + ') VALUES (' + valueString + ')';
//  return query(statement, values)
// }
// function addBulk(table, columns, valueArray) {
//  var values = valueArray.map(function(item1) {
//  item1 = item1.map(function(item2) {
//   return '?';
//   })
//  return '(' + item1.join(',') + ')'
//  }).join(',');
//  var parameters = []
//  for (var i = 0; i < valueArray.length; i++) {
//   for (var j = 0; j < valueArray[i].length; j++) {
//    parameters.push(valueArray[i][j])
//   }
//  }
// var statement = 'INSERT INTO ' + table + '(' + columns.join(',') + ') VALUES ' + values;
//  return query(statement, parameters)
// }
// function update(table, columnName, columnValue, columns, values) {
//  var colVals = columns.map(function(item, index) {
//   return item + ' = ?';
//  }).join(',');
//  var statement = 'UPDATE ' + table + ' SET ' + colVals + ' WHERE ' + columnName + '=\'' + columnValue + '\'';
//  return query(statement, values)
// }
// function updateBulk(table, columnName, columnValueArray, columns, values) {
//  var colVals = columns.map(function(item, index) {
//   return item + ' = ?';
//  }).join(',');
//  var columnValues = columnValueArray.join(',')
//  var statement = 'UPDATE ' + table + ' SET ' + colVals + ' WHERE ' + columnName + ' in(' + columnValues + ')';
//  return query(statement, values)
// }
// function deleteById(table, id) {
//  var statement = 'Delete from ' + table + ' where id = ?';
//  return query(statement, [id])
// }
// function addOrUpdate(table, id, columns, values) {
//  return getById(table, id, ['*']).then(function(data) {
//   if (Object.keys(data).length) {
//    return update(table, id, columns, values)
//   }
//   else {
//    columns.push('id')
//    values.push(id)
//    return add(table, columns, values)
//   }
//  })
// }
// function getByColumn(table, coulumnName, columnValue, columnsToFetch) {
//  var columnsToFetch = columnsToFetch.join(',');
//  var statement = 'SELECT ' + columnsToFetch + ' FROM ' + table + ' WHERE ' + coulumnName + ' = ?';
//  return query(statement, [columnValue]).then(function(result) {
//   return fetch(result);
//  });
// }
// function getBulkByColumn(table, coulumnName, columnValue, columnsToFetch) {
//  var columnsToFetch = columnsToFetch.join(',');
//  var statement = 'SELECT ' + columnsToFetch + ' FROM ' + table + ' WHERE ' + coulumnName + ' = ?';
//  return query(statement, [columnValue]).then(function(result) {
//   return fetchMany(result);
//   });
//  }
// }

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24; // milliseconds to minutes to hours to days

class Storage {
  constructor(obj) {
    this.db = window.sqlitePlugin ? sqlitePlugin.openDatabase({ name : 'race-day-app', iosDatabaseLocation : 'Documents' }) : window.openDatabase('race-day-app', '1.0', 'database', -1);

    this.db.transaction((transaction) => {
      transaction.executeSql('CREATE TABLE IF NOT EXISTS setting (key text primary key, value text)');
      transaction.executeSql('CREATE TABLE IF NOT EXISTS rider (id text primary key, name text, serial_number text, bmx_member_id text)');
      transaction.executeSql('CREATE TABLE IF NOT EXISTS rider_info (serial_number text primary key, data text, last_updated integer)');
      transaction.executeSql('CREATE TABLE IF NOT EXISTS racer_details (bmx_member_id text primary key, data text, last_updated integer)');
      transaction.executeSql('CREATE TABLE IF NOT EXISTS log_book_entry (id text primary key, event text, riders text, venue text, date integer, submitted_to_usa_bmx integer, json text)');
      transaction.executeSql('CREATE TABLE IF NOT EXISTS photo (id text primary key, parent text, image_data text)');
      transaction.executeSql('CREATE TABLE IF NOT EXISTS venue (id text primary key, name text, district text, city text, state text, latitude real, longitude real, data text)');
    });

    this.stageVenuesPromise = new Promise((resolve, reject) => {
      const venueDataStaged = localStorage.getItem('venueDataStaged');

      if (venueDataStaged) {
        return resolve();
      }

      // Seed data with tracks
      import(/* webpackChunkName: "tracks" */ './tracks.json').then(venuesModule => {
        // Filter venues without positions
        const venues = Object.values(venuesModule).filter(t => !Array.isArray(t)).filter(venue => {
          if (venue.latitude === null || venue.longitude === null) {
            console.warn('Venue with invalid location', venue);
            return false;
          }

          return true;
        });

        const venueChunks = this.chunk(venues.map(venue => [venue.id, venue.name, venue.district, venue.city, venue.state, venue.latitude, venue.longitude, JSON.stringify(venue)]), 20);

        Promise.all(venueChunks.map(chunk => {
          return this.addBulk(Venue.TABLE, Venue.COLUMNS, chunk);
        })).then(results => {
          localStorage.setItem('venueDataStaged', 'true');
          resolve();
        }).catch(error => {
          console.error(error);
          resolve();
        })
      })
    })

    window.DBStorage = this;
  }

  chunk = (array, size) => {
    const chunked_arr = [];
    let index = 0;

    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }

    return chunked_arr;
  }

  executeSql = (query, bindings) => {
    return new Promise((resolve, reject) => {
      this.db.transaction((transaction) => {
        transaction.executeSql(
          query, bindings !== undefined ? bindings : [],
          (transaction, result) => resolve(result),
          (transaction, error) => {
            console.error('FAILED TO EXECUTE SQL');
            console.error(query);
            console.error(bindings);
            console.error(transaction);
            console.error(error);
            reject(error)
          });
      })
    });
  }

  processResult = (result) => {
    const output = [];

    for (var i = 0; i < result.rows.length; i++) {
      const item = result.rows.item(i);

      if (item.data) {
        const data = JSON.parse(item.data);
        Object.assign(item, data);
        delete item.data;
      }

      output.push(item);
    }

    return output;
  }

  like = (table, column, value, columns) => {
    const statement = `SELECT ${columns === undefined ? '*' : columns.join(',')} FROM ${table} WHERE ${column} LIKE '%${value}%'`;
    return this.executeSql(statement).then(this.processResult)
  }

  getBy = (table, column, value, columns) => {
    const statement = `SELECT ${columns === undefined ? '*' : columns.join(',')} FROM ${table} WHERE ${column} = ?`;
    return this.executeSql(statement, [value]).then(this.processResult)
  }

  all = (table, columns, orderBy, orderType, limit) => {
    var statement = `SELECT ${columns ? columns.join(',') : '*'} FROM ${table}`;

    if (orderBy && orderType) {
      statement = `${statement} order by ${orderBy} ${orderType}`
    }

    if (limit !== undefined) {
      statement = `${statement} limit ${limit}`;
    }

    return this.executeSql(statement).then(this.processResult)
  }

  getById = (table, id, columns) => {
    return this.getBy(table, 'id', id, columns);
  }

  getBulkById = (table, ids, columns) => {
    const statement = `SELECT ${columns ? columns.join(',') : '*'} FROM ${table} WHERE id IN(${ids.map((id) => { return `'${id}'` }).join(', ')})`;
    return this.executeSql(statement).then(this.processResult)
  }

  add = (table, columns, values) => {
    const statement = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${values.map((v) => { return '?'}).join(',')})`;
    return this.executeSql(statement, values)
  }

  addBulk = (table, columns, valueArray) => {
    var values = valueArray.map(function(item1) {
      item1 = item1.map(function(item2) {  return '?'; });
      return '(' + item1.join(',') + ')'
    }).join(',');

    var parameters = []

    for (var i = 0; i < valueArray.length; i++) {
      for (var j = 0; j < valueArray[i].length; j++) {
        parameters.push(valueArray[i][j])
      }
    }

    var statement = 'INSERT INTO ' + table + '(' + columns.join(',') + ') VALUES ' + values;
    return this.executeSql(statement, parameters)
  }

  update = (table, columnName, columnValue, columns, values) => {
    const statement = `UPDATE ${table} SET ${columns.map((c) => { return `${c} = ?`}).join(',')} WHERE ${columnName}='${columnValue}'`;
    return this.executeSql(statement, values)
  }

  addOrUpdate = (table, id, columns, values) => {
    return this.getById(table, id, ['*']).then((results) => {
      if (results && results.length > 0) {
        return this.update(table, 'id', id, columns, values)
      } else {
        columns.push('id')
        values.push(id)
        return this.add(table, columns, values)
      }
    })
  }

  deleteById = (table, id) => {
    const statement = `DELETE FROM ${table} WHERE id = ?`;
    return this.executeSql(statement, [id])
  }

  deleteBy = (table, column, value) => {
    const statement = `DELETE FROM ${table} WHERE ${column} = ?`;
    return this.executeSql(statement, [value])
  }

  getRiderBySerial = (serial) => {
    return this.getBy('rider', 'serial_number', [serial]).then((results) => {
      return results[0];
    })
  }

  getRiderInfoBySerial = (serial) => {
    const { add } = this;

    return this.getBy('rider_info', 'serial_number', [serial]).then((results) => {
      if (results.length === 0) {
        return USABMX.getRiderInfoBySerial(serial).then((reply) => {
          const rider_info = reply[0];

          return add('rider_info', ['serial_number', 'data'], [serial, JSON.stringify(rider_info)]).then(() => {
            const name = (`${rider_info.first_name} ${rider_info.last_name}`).toUpperCase();

            return this.findRiderByName(name).then((riderResults) => {
              // merge
              if (riderResults && riderResults.length > 0) {
                const rider = riderResults[0];

                return this.addOrUpdate('rider', rider.id, ['name', 'serial_number', 'bmx_member_id'], [name, rider_info.serial_number, rider_info.id]).then(() => {
                  return rider_info;
                })
              } else {
                // create
                return add('rider', ['id', 'name', 'serial_number', 'bmx_member_id'], [uuid(), name, rider_info.serial_number, rider_info.id]).then(() => {
                  return rider_info;
                })
              }
            })
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(results[0]);
        })
      }
    })
  }

  getRacerDetailsByMemberId = (bmx_member_id) => {
    const { add, update } = this;

    if (!bmx_member_id) {
      return new Promise((resolve, reject) => {
        resolve(undefined);
      })
    }

    return this.getBy('racer_details', 'bmx_member_id', [bmx_member_id]).then((results) => {
      const result = results[0];

      if (!result || new Date().getTime() - result.last_updated > TWENTY_FOUR_HOURS) {
        return USABMX.getRacerDetailsByMemberId(bmx_member_id).then((details) => {
          if (result) {
            return update('racer_details', 'bmx_member_id', bmx_member_id, ['data'], [JSON.stringify(details)]).then(() => {
              return details;
            })
          } else {
            return add('racer_details', ['bmx_member_id', 'data'], [bmx_member_id, JSON.stringify(details)]).then(() => {
              return details;
            })
          }
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(result);
        })
      }
    })
  }

  getRider = (id) => {
    return this.getBy('rider', 'id', [id]).then((results) => {
      return results[0];
    })
  }

  getSetting = (key, defaultValue) => {
    const { add } = this;

    return this.getBy('setting', 'key', [key]).then((results) => {
      if (results.length === 0) {
        return add('setting', ['key', 'value'], [key, JSON.stringify(defaultValue)]).then(() => {
          return defaultValue;
        })
      }

      return results[0].value;
    })
  }

  updateSetting = (key, goal) => {
    return this.update('setting', 'key', key, ['value'], [goal]);
  }

  getAccelerometerSensitivity = () => {
    return this.getSetting('accelerometer_sensitivity', 2).then((v) => {
      return parseFloat(v);
    })
  }

  setAccelerometerSensitivity = (goal) => {
    this.updateSetting('accelerometer_sensitivity', goal)
  }

  getDistanceGoal = () => { // 30 FT
    return this.getSetting('distance_goal', 0.009144).then((v) => {
      return parseFloat(v);
    })
  }

  setDistanceGoal = (goal) => {
    this.updateSetting('distance_goal', goal)
  }

  getSpeedGoal = () => { // 20 MPH
    return this.getSetting('speed_goal', 8.9408).then((v) => {
      return parseFloat(v);
    })
  }

  setSpeedGoal = (goal) => {
    this.updateSetting('speed_goal', goal)
  }

  getRacerDetails = (rider) => {
    return this.getRacerDetailsByMemberId(rider.bmx_member_id);
  }

  findRiderByName = (name) => {
    return this.like('rider', 'name', name.toUpperCase());
  }

  totalRiders = () => {
    return this.executeSql('SELECT COUNT(*) from rider').then((results) => { return results.rows.item(0)['COUNT(*)'] });
  }

  riders = () => {
    return this.all('rider').then(riders => {
      return riders.map(rider => {
        return new Rider(rider);
      })
    })
  }

  logBookEntries = () => {
    return this.all('log_book_entry').then(logBookEntries => {
      return logBookEntries.map(logBookEntry => {
        return LogBookEntry.fromResult(logBookEntry);
      }).sort((a, b) => {
        if (a.date < b.date) {
          return 1
        } else if (a.date > b.date) {
          return -1;
        }

        return 0;
      })
    })
  }

  addRider = (name) => {
    const id = uuid();

    return this.add('rider', ['id', 'name'], [id, name.toUpperCase()]).then(() => {
      return this.getRider(id);
    })
  }

  deleteRiderById = (riderId) => {
    return new Promise((resolve, reject) => {
      this.getBy('rider', 'id', [riderId]).then((results) => {
        const rider = results && results[0];

        if (rider) {
          this.like('log_book_entry', 'riders', riderId).then((results) => {
            // Delete all logbook entries
            const promises = [results.map(result => LogBookEntry.fromJSON(result.json)).map(logBookEntry => logBookEntry.delete(this))];

            // Delete rider info
            if (rider.serial_number) {
              promises.push(this.deleteBy('rider_info', 'serial_number', rider.serial_number))
            }

            // Delete racer details
            if (rider.bmx_member_id) {
              promises.push(this.deleteBy('racer_details', 'bmx_member_id', rider.bmx_member_id))
            }

            if (promises.length > 0) {
              Promise.all(promises).then(() => {
                this.deleteById('rider', riderId).then(() => {
                  resolve();
                }, (error) => {
                  reject(error);
                })
              }).catch(err => reject(err));
            } else {
              this.deleteById('rider', riderId).then(() => {
                resolve();
              }, (error) => {
                reject(error);
              })
            }
          }).catch(err => reject(err));
        } else {
          reject(`No rider with id ${riderId} was found`)
        }
      })
    })
  }
}

export default Storage;
