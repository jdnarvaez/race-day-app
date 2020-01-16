import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { uuid } from 'uuidv4';
import { DateTime } from 'luxon';

import LogBookEntry from '../../../../model/LogBookEntry';

import VenueSelector from '../VenueSelector';
import EventSelector from '../EventSelector';
import CategorySelector from '../CategorySelector';
import PointsClassSelector from '../PointsClassSelector';
import RiderSelector from '../RiderSelector';
import AgeGroupSelector from '../AgeGroupSelector';

import Workflow from '../Workflow';

import './EntryWorkflow.css';

// Workflow
// Display list of races nearby on today's date
// Also allow entry of named session or race
// If they select a race from the list, populate information for them
// Otherwise walk through each step
// Select Track -> Select Race -> Select Rider -> Select Class
// Manual Entry -> Select Race -> Manual Entry -> Race Name, Series, Points
class EntryWorkflow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanelIndex : 0,
      logBookEntry : undefined,
      panelNames : ['Select Venue', 'Select Event', 'Select Category', 'Select Points Class', 'Select Rider', 'Select Age Group']
    }
  }

  onBack = () => {
    const { cancelEntry } = this.props;
    const { activePanelIndex } = this.state;

    switch(activePanelIndex) {
      case 0:
        return cancelEntry();
      default:
        return this.setState({ activePanelIndex : activePanelIndex - 1 });
    }
  }

  onForward = (e, logBookEntry) => {
    const { addEntry } = this.props;
    const { activePanelIndex, panelNames } = this.state;

    if (activePanelIndex === panelNames.length - 1) {
      if (this.props.logBookEntry) {
        const logBookEntry = this.props.logBookEntry;

        if (logBookEntry.event && logBookEntry.event.eventName) {
          logBookEntry.event.name = logBookEntry.event.eventName();
        } else if (!logBookEntry.event) {
          logBookEntry.event = {
            id : uuid(),
            name : logBookEntry.category || 'Session'
          }
        }

        if (!logBookEntry.event.name) {
          logBookEntry.event.name = logBookEntry.category || 'Session';
        }

        return this.setState({ logBookEntry : undefined }, () => {
          this.props.updateLogBookEntryById(logBookEntry.id);
          this.props.cancelEntry();
        })
      }

      var entry = logBookEntry || this.state.logBookEntry;

      if (entry.event && entry.event.eventName) {
        entry.event.name = entry.event.eventName();
      } else if (!logBookEntry.event) {
        logBookEntry.event = {
          id : uuid(),
          name : entry.category || 'Session'
        }
      }

      if (!entry.event.name) {
        entry.event.name = entry.category || 'Session';
      }

      return addEntry(entry);
    }

    const nextState = { activePanelIndex : activePanelIndex + 1 };

    if (logBookEntry) {
      if (logBookEntry.isPractice()) {
        if (nextState.activePanelIndex === 2 || nextState.activePanelIndex === 3) {
          nextState.activePanelIndex = 4;
        }
      }

      nextState.logBookEntry = logBookEntry;
    }

    return this.setState(nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.show && prevProps.show !== this.props.show) {
      if (!this.props.logBookEntry) {
        const logBookEntry = new LogBookEntry();
        logBookEntry.addEntry();
        this.setState({ logBookEntry : logBookEntry, activePanelIndex : 0 })
      } else {
        this.setState({ logBookEntry : this.props.logBookEntry, activePanelIndex : 0 })
      }
    }

    if (this.state.logBookEntry && this.state.logBookEntry.isPractice() && prevState.activePanelIndex === 4 && this.state.activePanelIndex === 5) {
      this.onForward(undefined, this.state.logBookEntry);
    }
  }

  render() {
    const { onBack, onForward } = this;
    const { app, width, height, show, storage, updateLogBook } = this.props;
    const { activePanelIndex, logBookEntry, panelNames } = this.state;

    const panels = [];

    if (show && logBookEntry) {
      panels.push(<VenueSelector logBookEntry={logBookEntry} onSelect={onForward} storage={storage} />);
      panels.push(<EventSelector logBookEntry={logBookEntry} venue={logBookEntry.venue} onSelect={onForward} storage={storage} />);
      panels.push(<CategorySelector logBookEntry={logBookEntry} venue={logBookEntry.venue} onSelect={onForward} storage={storage} />);
      panels.push(<PointsClassSelector logBookEntry={logBookEntry} venue={logBookEntry.venue} onSelect={onForward} storage={storage} />);

      logBookEntry.riderEntries.forEach(entry => {
        panels.push(<RiderSelector logBookEntry={logBookEntry} entry={entry} onSelect={onForward} storage={storage} updateLogBook={updateLogBook} />)
        panels.push(<AgeGroupSelector logBookEntry={logBookEntry} entry={entry} onSelect={onForward} storage={storage} />)
      })
    }

    return (
      <Workflow activePanelIndex={activePanelIndex} show={show} onBack={onBack} onForward={onForward} panels={panels} panelNames={panelNames} width={width} height={height} />
  	);
  }
}

export default EntryWorkflow;
