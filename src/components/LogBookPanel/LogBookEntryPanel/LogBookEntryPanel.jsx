import React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { uuid } from 'uuidv4';
import Toggle from 'react-toggle';
import Collapse, { Panel } from 'rc-collapse';
import { isAndroid } from 'react-device-detect';

import LogBookEntry from '../../../model/LogBookEntry';
import { Input, TextArea } from '../../Input';
import RiderPanel from './RiderPanel';

import './LogBookEntryPanel.css';

const MOTO_NAMES = {
  'sixteenth' : '<sup>1</sup>/<sub>16</sub>',
  'eighth' : '<sup>1</sup>/<sub>8</sub>',
  'quarter' : '<sup>1</sup>/<sub>4</sub>',
}

class LogBookEntryPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.retrieveLogBookEntry();
  }

  componentDidUpdate(prevProps) {
    if (this.props.logBookEntryId !== prevProps.logBookEntryId) {
      this.retrieveLogBookEntry();
    }
  }

  retrieveLogBookEntry = () => {
    const { storage, logBookEntryId } = this.props;

    LogBookEntry.get(storage, logBookEntryId).then(logBookEntry => {
      if (this.props.logBookEntryId === logBookEntry.id) {
        this.setState({ logBookEntry });
      }
    })
  }

  mapMotoName = (motoName) => {
    return MOTO_NAMES[motoName] || motoName;
  }

  updateLogBookEntry = () => {
    const { storage } = this.props;
    const { logBookEntry, deleted } = this.state;

    if (deleted || logBookEntry.deleted) {
      return;
    }

    return logBookEntry.save(storage).then((r) => {
      this.setState({ logBookEntry });
    }, (error) => {
      console.error(error);
    })
  }

  onEntryFeeChanged = (event) => {
    const { updateLogBookEntry } = this;
    const { logBookEntry } = this.state;
    logBookEntry.entryFee = event.target.value;
    updateLogBookEntry();
    return event.target.value;
  }

  onTotalMotosChanged = (event) => {
    const { updateLogBookEntry } = this;
    const { logBookEntry } = this.state;
    logBookEntry.totalMotos = event.target.value;
    updateLogBookEntry();
    return event.target.value;
  }

  handleSubmittedToUSABMX = (event) => {
    const { updateLogBookEntry } = this;
    const { logBookEntry } = this.state;
    logBookEntry.submittedToUSABMX = event.target.checked;
    updateLogBookEntry();
  }

  deleteLogBookEntry = () => {
    const { storage } = this.props;
    const { logBookEntry } = this.state;

    this.setState({ deleted : true }, () => {
      setTimeout(() => {
        logBookEntry.delete(storage).then(() => {
          this.props.deleteLogBookEntry(logBookEntry);
        }).catch(error => {
          console.error(error);
          this.setState({ deleted : false })
        })
      }, 250)
    })
  }

  editLogBookEntry = () => {
    const { logBookEntry } = this.state;

    if (!logBookEntry) {
      return;
    }

    this.props.editLogBookEntry(logBookEntry);
  }

  editLogBookEntryDate = () => {
    const { logBookEntry } = this.state;

    if (!logBookEntry) {
      return;
    }

    this.props.editLogBookEntryDate(logBookEntry);
  }

  render() {
    const { selectMoto, mapMotoName, updateLogBookEntry, onEntryFeeChanged, onTotalMotosChanged, deleteLogBookEntry, editLogBookEntry, editLogBookEntryDate } = this;
    const { width, setCurrentLogBookEntry, storage } = this.props;
    const { selectedMoto, deleted, logBookEntry } = this.state;

    if (!logBookEntry) {
      return <div className="logbook-entry placeholder" style={{ width : `${width}px`}}/>;
    }

    const isPractice = logBookEntry.isPractice();

    return (
      <div className={`logbook-entry ${deleted ? 'deleted' : ''} ${isAndroid ? 'android' : ''}`} style={{ width : `${width}px`}} id={logBookEntry.id}>
        <div className="header">
          <div className="title" onClick={editLogBookEntry}>{logBookEntry.event.name}</div>
          <div className="track" onClick={editLogBookEntry}>{logBookEntry.venue.name}</div>
          <div className="date" onClick={editLogBookEntryDate}>{logBookEntry.date.toLocaleString(DateTime.DATE_HUGE)}</div>
          <div className="category-points">
            <div className="category" onClick={editLogBookEntry}>{logBookEntry.category}</div>
            {!isPractice && <div className="points" onClick={editLogBookEntry}>{logBookEntry.pointsClass.name}</div>}
          </div>
          <div className="extras">
            <Input
              className="compact"
              label="Entry Fee"
              locked={false}
              active={false}
              type="number"
              onChange={onEntryFeeChanged}
              value={logBookEntry.entryFee}
            />
            {!isPractice && <Input
              className="compact total-motos"
              label="Total Motos"
              locked={false}
              active={false}
              type="number"
              onChange={onTotalMotosChanged}
              value={logBookEntry.totalMotos}
            />}
          </div>
        </div>
        <div className="riders">
          {logBookEntry.riderEntries.map((entry) => {
            return (
              <RiderPanel
                key={entry.id}
                logBookEntry={logBookEntry}
                entry={entry}
                mapMotoName={mapMotoName}
                width={width}
                updateLogBookEntry={updateLogBookEntry}
                deleteLogBookEntry={deleteLogBookEntry}
                isPractice={isPractice}
                setCurrentLogBookEntry={setCurrentLogBookEntry}
                width={width}
                storage={storage} />
              )
          })}
        </div>
        {!isPractice && <div className="footer">
          <div className="submitted">
            <div className="caption">posted to USA BMX</div>
            <Toggle
              defaultChecked={logBookEntry.submittedToUSABMX}
              icons={false}
              onChange={this.handleSubmittedToUSABMX} />
          </div>
        </div>}
      </div>
  	);
  }
}

export default LogBookEntryPanel;
