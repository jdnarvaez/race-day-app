import { uuid } from 'uuidv4';
import { DateTime } from 'luxon';

import MotoEntry from './MotoEntry';
import RiderEntry from './RiderEntry';
import Photo from './Photo';

const TABLE = 'log_book_entry';
const COLUMNS = ['id', 'event', 'riders', 'venue', 'date', 'submitted_to_usa_bmx', 'json'];

class LogBookEntry {
  static allIds(storage) {
    return storage.all(LogBookEntry.TABLE, ['id'], 'date', 'DESC').then(results => results.map(r => r.id));
  }

  static fromJSON(json) {
    const logBookEntry = new LogBookEntry(JSON.parse(json));
    logBookEntry.date = DateTime.fromMillis(logBookEntry.date);

    logBookEntry.riderEntries = logBookEntry.riderEntries.map(entry => {
      const riderEntry = new RiderEntry(entry);

      riderEntry.photos = riderEntry.photos.map(photo => {
        return new Photo(photo);
      });

      riderEntry.motos = riderEntry.motos.map(moto => {
        const motoEntry = new MotoEntry(moto);

        motoEntry.photos = motoEntry.photos.map(photo => {
          return new Photo(photo);
        });

        return motoEntry;
      });

      return riderEntry;
    });

    return logBookEntry;
  }

  static get(storage, id) {
    return storage.getById(LogBookEntry.TABLE, id, ['json']).then(results => {
      return LogBookEntry.fromJSON(results[0].json);
    });
  }

  static addOrUpdate(storage, logBookEntry) {
    const { riderEntries, ...entryToStore } = logBookEntry;
    entryToStore.date = entryToStore.date.toMillis();

    entryToStore.riderEntries = logBookEntry.riderEntries.map(entry => {
      const entryCopy = Object.assign({}, entry);

      entryCopy.photos = entryCopy.photos.map(photo => {
        return {
          id : photo.id,
          parent : photo.parent
        }
      });

      entryCopy.motos = entryCopy.motos.map(moto => {
        const motoCopy = Object.assign({}, moto);

        motoCopy.photos = motoCopy.photos.map(photo => {
          return {
            id : photo.id,
            parent : photo.parent
          }
        })

        return motoCopy;
      });

      return entryCopy;
    });

    const riders = entryToStore.riderEntries.map(riderEntry => riderEntry.rider.id).join(',');
    const data = JSON.stringify(entryToStore);

    const columns = [];
    const values = [];

    if (entryToStore.event && entryToStore.event.id) {
      columns.push('event');
      values.push(entryToStore.event.id);
    }

    columns.push('riders');
    values.push(riders);

    if (entryToStore.venue && entryToStore.venue.id) {
      columns.push('venue');
      values.push(entryToStore.venue.id);
    }

    columns.push('date');
    values.push(entryToStore.date);

    columns.push('submitted_to_usa_bmx');
    values.push(entryToStore.submittedToUSABMX ? 1 : 0);

    columns.push('json');
    values.push(data);

    return storage.addOrUpdate(LogBookEntry.TABLE, logBookEntry.id,
      columns,
      values
    );
  }

  static deleteTree(storage, logBookEntry) {
    const promises = [];

    logBookEntry.riderEntries.forEach(entry => {
      entry.photos.forEach(photo => {
        promises.push(Photo.delete(storage, photo.id));
      })

      entry.motos.forEach(moto => {
        moto.photos.forEach(photo => {
          promises.push(Photo.delete(storage, photo.id));
        })
      });
    });

    promises.push(storage.deleteById(LogBookEntry.TABLE, logBookEntry.id));
    return Promise.all(promises);
  }

  constructor(props) {
    this.id = uuid();
    this.submittedToUSABMX = false;
    this.date = DateTime.fromJSDate(new Date());

    this.venue = {
      id : undefined,
      name : undefined
    };

    this.event = {
      id : undefined,
      name : undefined
    };

    this.pointsClass = {
      name : 'No Points',
      id : 0,
    }

    this.riderEntries = [];
    Object.assign(this, props);
  }

  isPractice = () => {
    return this.event.name === 'Practice' || this.category === 'Practice' || (this.event.eventName && this.event.eventName() === 'Practice');
  }

  addEntry = () => {
    const entry = new RiderEntry();
    entry.motos.push(new MotoEntry({ name : 'm 1', number : '', finish : '' }));
    entry.motos.push(new MotoEntry({ name : 'm 2', number : '', finish : '' }));
    entry.motos.push(new MotoEntry({ name : 'm 3', number : '', finish : '' }));
    entry.motos.push(new MotoEntry({ name : 'sixteenth', number : '', finish : '' }));
    entry.motos.push(new MotoEntry({ name : 'eighth', number : '', finish : '' }));
    entry.motos.push(new MotoEntry({ name : 'quarter', number : '', finish : '' }));
    entry.motos.push(new MotoEntry({ name : 'semi', number : '', finish : '' }));
    entry.motos.push(new MotoEntry({ name : 'main', number : '', finish : '' }));
    this.riderEntries.push(entry);
    return entry;
  }

  removeEntry = (entry) => {
    const idx = this.riderEntries.indexOf(entry);

    if (idx >= 0) {
      this.riderEntries.splice(idx, 1);
    }
  }

  save = (storage) => {
    return LogBookEntry.addOrUpdate(storage, this);
  }

  delete = (storage) => {
    return LogBookEntry.deleteTree(storage, this);
  }
}

LogBookEntry.TABLE = TABLE;
LogBookEntry.COLUMNS = COLUMNS;

export default LogBookEntry;
