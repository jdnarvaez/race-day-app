import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { uuid } from 'uuidv4';
import { DateTime } from 'luxon';

import RiderSelector from '../RiderSelector';
import AgeGroupSelector from '../AgeGroupSelector';

import Workflow from '../Workflow';

import './AddRiderWorkflow.css';

class AddRiderWorkflow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanelIndex : 0,
      panelNames : ['Select Rider', 'Select Age Group']
    }
  }

  onBack = () => {
    const { cancelEntry, logBookEntry, updateLogBookEntryById } = this.props;
    const { activePanelIndex, entry } = this.state;

    switch(activePanelIndex) {
      case 0:
        logBookEntry.removeEntry(entry);
        updateLogBookEntryById(logBookEntry.id);
        return cancelEntry();
      default:
        return this.setState({ activePanelIndex : activePanelIndex - 1 });
    }
  }

  onForward = (e) => {
    const { cancelEntry, logBookEntry, updateLogBookEntryById } = this.props;
    const { activePanelIndex, panelNames } = this.state;

    if (activePanelIndex === panelNames.length - 1) {
      updateLogBookEntryById(logBookEntry.id)
      return cancelEntry();
    }

    const nextState = { activePanelIndex : activePanelIndex + 1 };
    return this.setState(nextState);
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && prevProps.show !== this.props.show) {
      const entry = this.props.logBookEntry.addEntry();
      this.setState({ entry : entry, activePanelIndex : 0 })
    }
  }

  render() {
    const { onBack, onForward } = this;
    const { app, width, height, show, logBookEntry, storage, updateLogBook } = this.props;
    const { activePanelIndex, entry, panelNames } = this.state;

    const panels = [];

    if (show && logBookEntry && entry) {
      panels.push(<RiderSelector logBookEntry={logBookEntry} entry={entry} onSelect={onForward} storage={storage} updateLogBook={updateLogBook} />)
      panels.push(<AgeGroupSelector logBookEntry={logBookEntry} entry={entry} onSelect={onForward} storage={storage} />)
    }

    return (<Workflow activePanelIndex={activePanelIndex} show={show} onBack={onBack} onForward={onForward} panels={panels} panelNames={panelNames} width={width} height={height} />);
  }
}

export default AddRiderWorkflow;
