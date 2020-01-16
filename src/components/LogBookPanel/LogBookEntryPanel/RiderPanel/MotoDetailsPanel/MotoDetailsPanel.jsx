import React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { uuid } from 'uuidv4';
import Toggle from 'react-toggle';

import { Input, TextArea } from '../../../../Input';
import PhotosPanel from '../../PhotosPanel';

import './MotoDetailsPanel.css';

class MotoDetailsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMoto : undefined
    }
  }

  onChangeMotoNumber = (event) => {
    const { updateLogBookEntry, moto } = this.props;
    moto.number = event.target.value;
    updateLogBookEntry();
    return moto.number;
  }

  onChangeMotoFinish = (event) => {
    const { updateLogBookEntry, moto } = this.props;
    const number = event.target.value;
    moto.finish = number.substring(number.length - 1, number.length);

    if (moto.finish === '9') {
      moto.finish = '';
    }

    updateLogBookEntry();
    return moto.finish;
  }

  onChangeLaneNumber = (event) => {
    const { updateLogBookEntry, moto } = this.props;
    const number = event.target.value;
    moto.laneNumber = number.substring(number.length - 1, number.length);

    if (moto.laneNumber === '9') {
      moto.laneNumber = '';
    }

    updateLogBookEntry();
    return moto.laneNumber;
  }

  onChangeRidersInMoto = (event) => {
    const { updateLogBookEntry, moto } = this.props;
    const number = event.target.value;
    moto.ridersInMoto = number.substring(number.length - 1, number.length);

    if (moto.ridersInMoto === '9') {
      moto.ridersInMoto = '';
    }

    updateLogBookEntry();
    return moto.ridersInMoto;
  }

  onChangeTransferSpotsAvailable = (event) => {
    const { updateLogBookEntry, moto } = this.props;
    const number = event.target.value;
    moto.transferSpotsAvailable = number.substring(number.length - 1, number.length);

    if (moto.transferSpotsAvailable === '9') {
      moto.transferSpotsAvailable = '';
    }

    updateLogBookEntry();
    return moto.transferSpotsAvailable;
  }

  onChangeNotes = (event) => {
    const { updateLogBookEntry, moto } = this.props;
    moto.notes = event.target.value;
    updateLogBookEntry();
    return moto.notes;
  }

  render() {
    const { onChangeMotoNumber, onChangeMotoFinish, onChangeLaneNumber, onChangeRidersInMoto, onChangeTransferSpotsAvailable, onChangeNotes } = this;
    const { updateLogBookEntry, logBookEntry, entry, moto, selectMoto, mapMotoName, width, storage } = this.props;

    return (
      <React.Fragment>
        <div className={`motos selected-moto`}>
          <div className="rounds">
            <div className="round">
              <div className="title" dangerouslySetInnerHTML={{ __html : mapMotoName(moto && moto.name) }} onClick={(e) => selectMoto(moto)} />
            </div>
          </div>
        </div>
        {moto && <div className={`moto-details`}>
          <Input
            label="Moto Number"
            locked={false}
            active={false}
            type="number"
            onChange={onChangeMotoNumber}
            value={moto.number}
          />
          <Input
            label="Lane Number"
            locked={false}
            active={false}
            type="number"
            onChange={onChangeLaneNumber}
            value={moto.laneNumber}
          />
          <Input
            label="Finish Position"
            locked={false}
            active={false}
            type="number"
            onChange={onChangeMotoFinish}
            value={moto.finish}
          />
          <Input
            label="Riders in Moto"
            locked={false}
            active={false}
            type="number"
            onChange={onChangeRidersInMoto}
            value={moto.ridersInMoto}
          />
          <Input
            label="Transfer Spots Available"
            locked={false}
            active={false}
            type="number"
            onChange={onChangeTransferSpotsAvailable}
            value={moto.transferSpotsAvailable}
          />
          <TextArea
            label="Moto Notes"
            locked={false}
            active={false}
            type="text"
            onChange={onChangeNotes}
            value={moto.notes}
          />
          <PhotosPanel width={width} parent={moto} updateLogBookEntry={updateLogBookEntry} storage={storage} />
        </div>}
      </React.Fragment>
  	);
  }
}

export default MotoDetailsPanel;
