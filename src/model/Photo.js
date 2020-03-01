import { uuid } from 'uuidv4';

class Photo {
  static getImageData(storage, id) {
    return storage.getById('photo', id, ['image_data'])
    .then((results) => {
      return results[0].image_data;
    })
  }

  static save(storage, photo) {
    return storage.addOrUpdate('photo', photo.id, ['parent', 'image_data'], [photo.parent, photo.imageData]);
  }

  static delete(storage, id) {
    return storage.deleteById('photo', id);
  }

  constructor(props) {
    this.id = uuid();
    this.parent = undefined;
    this.imageData = undefined;
    Object.assign(this, props);
  }

  data = (storage) => {
    return Photo.getImageData(storage, this.id);
  }

  save = (storage) => {
    return Photo.save(storage, this);
  }

  delete = (storage) => {
    return Photo.save(storage, this.id);
  }
}

export default Photo;
