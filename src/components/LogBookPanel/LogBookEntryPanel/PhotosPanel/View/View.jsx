import React from 'react';

import Photo from '../../../../../model/Photo';

import './View.css';

class PhotoPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

    if (this.props.data !== prevProps.data || (this.props.data && prevProps.data && this.props.data.id !== prevProps.data.id)) {
      retrievePhoto();
    }
  }

  retrievePhoto = () => {
    clearTimeout(this.retrieveTimeout);

    this.retrieveTimeout = setTimeout(() => {
      const { storage, photo }  = this.props.data;

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

  render() {
    const { imageData } = this.state;
    const { photo, toggleModal } = this.props.data;

    return (
      <div className={`carousel-photo-view`} key={photo.id} onClick={(e) => toggleModal(photo.id) } style={{ height : `${innerHeight - 65 - 35}px`, width : `${innerWidth}px` }}>
        {(photo.imageData || imageData) && <img src={`data:image/jpeg;base64,${photo.imageData || imageData}`} />}
      </div>
  	);
  }
}

export default PhotoPanel;
