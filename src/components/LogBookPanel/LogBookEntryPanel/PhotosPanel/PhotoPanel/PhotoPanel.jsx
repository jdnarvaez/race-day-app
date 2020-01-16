import React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FixedSizeList as List } from 'react-window';
import Swipeout from 'rc-swipeout';

import Photo from '../../../../../model/Photo';

import './PhotoPanel.css';

class PhotoPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleted : false,
      imageData : undefined
    }
  }

  componentDidMount() {
    this._mounted = true;
    this.retrievePhoto();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
    const { retrievePhoto } = this;

    if (this.props.photo !== prevProps.photo || (this.props.photo && prevProps.photo && this.props.photo.id !== prevProps.photo.id)) {
      retrievePhoto();
    }
  }

  retrievePhoto = () => {
    clearTimeout(this.retrieveTimeout);

    this.retrieveTimeout = setTimeout(() => {
      const { storage, photo }  = this.props;

      if (!this._mounted) {
        return;
      }

      photo.data(storage).then((imageData) => {
        if (this._mounted) {
          this.setState({ imageData : imageData });
        }
      }).catch(error => {
        console.error(`Unable to retrieve image data for photo ${photo.id}`)
      })
    }, 100);
  }

  deletePhoto = () => {
    const { updateLogBookEntry, parent, photo, storage } = this.props;
    const idx = parent.photos.indexOf(photo);

    if (idx >= 0) {
      this.setState({ deleted : true }, () => {
        setTimeout(() => {
          photo.delete(storage).then(() => {
            parent.photos.splice(idx, 1);
            updateLogBookEntry();
          }).catch((error) => {
            console.error(error);
            this.setState({ deleted : false });
          })
        }, 250);
      })
    }
  }

  render() {
    const { deletePhoto } = this;
    const { deleted, imageData } = this.state;
    const { photo, toggleModal } = this.props;

    return (
      <div className={`photo-container ${deleted && 'deleted'}`} style={this.props.style}>
        <Swipeout
          autoClose={true}
          right={[
            {
              text : 'delete',
              onPress : deletePhoto,
              style : { backgroundColor: 'rgba(var(--danger-color), .5)', color : 'rgba(var(--foreground-color), 1)' },
            }
          ]}>
          <div className={`photo`} key={photo.id} onClick={(e) => toggleModal(photo.id) }>
            {(photo.imageData || imageData) && <img src={`data:image/jpeg;base64,${photo.imageData || imageData}`} />}
          </div>
        </Swipeout>
      </div>
  	);
  }
}

export default PhotoPanel;
