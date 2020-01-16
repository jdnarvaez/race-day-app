import React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Collapse, { Panel } from 'rc-collapse';
import Swipeout from 'rc-swipeout';

import { Input, TextArea } from '../../../Input';
import MotoEntryPanel from './MotoEntryPanel';
import MotoDetailsPanel from './MotoDetailsPanel';
import AwardSelector from './AwardSelector';
import PhotosPanel from '../PhotosPanel';

import './RiderPanel.css';

class RiderPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMoto : undefined
    }
  }

  selectMoto = (moto) => {
    const { selectedMoto } = this.state;

    if (selectedMoto === moto) {
      this.setState({ selectedMoto : undefined });
    } else {
      this.setState({ selectedMoto : moto });
    }
  }

  onTotalRidersChanged = (event) => {
    const { updateLogBookEntry } = this.props;
    const { entry } = this.props;
    entry.totalRiders = event.target.value;
    updateLogBookEntry();
    return event.target.value;
  }

  deleteEntry = () => {
    const { logBookEntry, entry, updateLogBookEntry, deleteLogBookEntry } = this.props;
    const idx = logBookEntry.riderEntries.indexOf(entry);

    if (idx >= 0) {
      if (logBookEntry.riderEntries.length === 1) {
        deleteLogBookEntry();
      } else {
        logBookEntry.riderEntries.splice(idx, 1);
        updateLogBookEntry();
      }
    }
  }

  onChangeNotes = (event) => {
    const { updateLogBookEntry, logBookEntry } = this.props;
    logBookEntry.notes = event.target.value;
    updateLogBookEntry();
    return logBookEntry.notes;
  }

  render() {
    const { selectMoto, onTotalRidersChanged, deleteEntry, onChangeNotes } = this;
    const { logBookEntry, entry, mapMotoName, width, updateLogBookEntry, isPractice, setCurrentLogBookEntry, storage } = this.props;
    const { selectedMoto } = this.state;

    return (
      <div className="rider">
        <Swipeout
          right={[
            {
              text : 'delete',
              onPress : deleteEntry,
              style : { backgroundColor: 'rgba(var(--danger-color), .5)', color : 'rgba(var(--foreground-color), 1)' },
            }
          ]}>
          <div className="title">
            <div className="name">{entry.rider.name}</div>
            {!isPractice && <div className="proficiency">{entry.ageGroup}</div>}
          </div>
          <div className="extras">
            {!isPractice && <Input
              className="compact"
              style={{ padding : '0px 0px' }}
              label="Total Riders"
              locked={false}
              active={false}
              type="number"
              value={entry.totalRiders}
              onChange={onTotalRidersChanged}
            />}
          </div>
          <div className="add-rider" onClick={(e) => setCurrentLogBookEntry(logBookEntry)}><FontAwesomeIcon icon={faPlus} className="icon" /></div>
        </Swipeout>
        {!isPractice &&
        <React.Fragment>
          <Collapse
            accordion={true}
            activeKey={selectedMoto ? '1' : '0'}
            className="moto-details-accordion"
          >
            <Panel header={`Motos`} key="0">
              <div className={`motos`}>
                <div className="rounds">
                  {entry.motos.map((moto) => {
                    return (<MotoEntryPanel logBookEntry={logBookEntry} entry={entry} moto={moto} selectMoto={selectMoto} mapMotoName={mapMotoName} key={moto.id} updateLogBookEntry={updateLogBookEntry} />)
                  })}
                </div>
              </div>
            </Panel>
            <Panel header={`Moto Details`} key="1">
              <MotoDetailsPanel logBookEntry={logBookEntry} entry={entry} moto={selectedMoto} selectMoto={selectMoto} mapMotoName={mapMotoName} updateLogBookEntry={updateLogBookEntry} width={width} storage={storage} />
            </Panel>
          </Collapse>
          <AwardSelector logBookEntry={logBookEntry} entry={entry} width={width} updateLogBookEntry={updateLogBookEntry} />
        </React.Fragment>}
        <div className="notes">
          <TextArea
            label="Rider Notes"
            locked={false}
            active={false}
            type="text"
            value={logBookEntry.notes}
            onChange={onChangeNotes} />
        </div>
        <PhotosPanel width={width} parent={entry} updateLogBookEntry={updateLogBookEntry} storage={storage} />
      </div>
  	);
  }
}

export default RiderPanel;
