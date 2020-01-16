import React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FixedSizeList as List } from 'react-window';
import Swipeout from 'rc-swipeout';
import Carousel, { Modal, ModalGateway } from 'react-images';

import Photo from '../../../../model/Photo';
import PhotoPanel from './PhotoPanel';
import View from './View';

import './PhotosPanel.css';

class PhotosPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentImage : 0,
      modalIsOpen : false
    }
  }

  toggleModal = (photoId) => {
    const { parent } = this.props;
    let currentImage = 0;

    if (photoId) {
      currentImage = parent.photos.map(photo => photo.id).indexOf(photoId);
    }

    this.setState(state => ({ modalIsOpen : !state.modalIsOpen, currentImage : currentImage }));
  }

  addPhoto = () => {
    const { updateLogBookEntry, parent, storage } = this.props;

    window.plugins.actionsheet.show({
      androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
      // title: 'What do you want with this image?',
      // subtitle: 'Choose wisely, my friend',
      buttonLabels: ['Camera', 'Photo Library'],
      androidEnableCancelButton : true,
      addCancelButtonWithLabel: 'Cancel'
    }, (buttonIndex) => {
      navigator.camera.getPicture((imageData) => {
        const photo = new Photo({ imageData : imageData, parent : parent.id });

        photo.save(storage).then(() => {
          parent.photos.unshift(photo);
          updateLogBookEntry();
        }, (error) => console.error(error));
      }, (error) => {
        console.error(error);
      }, {
        sourceType : buttonIndex === 1 ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
        quality : 90,
        correctOrientation : true,
        destinationType : Camera.DestinationType.DATA_URL
      });
    });
  }

  renderItem = ({ index, key, style }) => {
    const { addPhoto, deletePhoto, toggleModal } = this;
    const { parent, updateLogBookEntry, storage } = this.props;

    if (index === parent.photos.length) {
      return (
        <div className="photo-container" key={'new-photo'} style={style}>
          <div className="photo new-photo ripple" onClick={addPhoto}>
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
      )
    } else {
      const photo = parent.photos[index];

      return (
        <PhotoPanel key={photo.id} style={style} updateLogBookEntry={updateLogBookEntry} parent={parent} photo={photo} storage={storage} toggleModal={toggleModal} />
      )
    }
  }

  render() {
    const { currentImage, modalIsOpen } = this.state;
    const { renderItem, toggleModal } = this;
    const { width, parent, storage } = this.props;
    const views = modalIsOpen ? parent.photos.map(photo => { return { id : photo.id, photo : photo, storage : storage, toggleModal : toggleModal } }) : null;

    return (
      <div className="photos-panel">
        <ModalGateway>
        {modalIsOpen ? (
          <Modal
            allowFullscreen={false}
            onClose={toggleModal}>
            <Carousel
              interactionIsIdle={false}
              components={{ Footer : null, View : View }}
              frameProps={{ autoSize : 'height' }}
              currentImage={currentImage}
              views={views}
            />
          </Modal>
        ) : null}
        </ModalGateway>
        <List
          className="photos"
          height={75}
          itemSize={110}
          itemCount={parent.photos.length + 1}
          layout="horizontal"
          width={width - 20}
        >
          {renderItem}
        </List>
      </div>
  	);
  }
}

export default PhotosPanel;
