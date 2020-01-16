import React from 'react';
import ReactDOM from 'react-dom';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHandPointRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FixedSizeList as List } from 'react-window';
import InfiniteCalendar from 'react-infinite-calendar';

import LogBookEntry from '../../model/LogBookEntry';
import { EntryWorkflow, AddRiderWorkflow } from './Workflows';
import LogBookEntryPanel from './LogBookEntryPanel';

import './LogBookPanel.css';
import './Calendar.css';

// TODO: weather conditions
// borders based on race type maybe change header colors
// edit workflow for name, date, series, location
// show workflow pane specifc to what was clicked
// edit workflows & filters for fast search of items in lists
// custom location name
// custom event name
// calendar icon to search for a specific date

const CALENDAR_THEME =  {
  accentColor: 'rgba(var(--active-color), 1)',
  floatingNav: {
    background: 'rgba(var(--background-color), 0.9)',
    chevron: 'rgba(var(--active-color), 1)',
    color: 'rgba(var(--foreground-color), 1)',
  },
  headerColor: 'rgba(var(--background-color), 1)',
  selectionColor: 'rgba(var(--active-color), 1)',
  textColor: {
    active: 'rgba(var(--foreground-color), 1)',
    default: 'rgba(var(--foreground-color), 1)',
  },
  todayColor: 'rgba(var(--active-color), .5)',
  weekdayColor: 'rgba(var(--background-color), 1)',
};

class LogBookPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewEntryWorkflow : false,
      currentLogBookEntry : undefined,
      editDateLogbookEntry : undefined,
      entryIds : []
    }

    this.listRef = React.createRef();
  }

  componentDidMount() {
    const { updateLogBook } = this;
    updateLogBook();
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateLogBook } = this;

    if (prevProps.activePanel !== this.props.activePanel && this.props.activePanel) {
      updateLogBook();
    }
  }

  updateLogBook = () => {
    const { storage } = this.props;

    LogBookEntry.allIds(storage).then(entryIds => {
      this.setState({ entryIds });
    })
  }

  findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find(key=>key.startsWith("__reactInternalInstance$"));
    const domFiber = dom[key];
    if (domFiber == null) return null;

    // react <16
    if (domFiber._currentElement) {
        let compFiber = domFiber._currentElement._owner;
        for (let i = 0; i < traverseUp; i++) {
            compFiber = compFiber._currentElement._owner;
        }
        return compFiber._instance;
    }

    // react 16+
    const GetCompFiber = fiber=>{
        //return fiber._debugOwner; // this also works, but is __DEV__ only
        let parentFiber = fiber.return;
        while (typeof parentFiber.type == "string") {
            parentFiber = parentFiber.return;
        }
        return parentFiber;
    };
    let compFiber = GetCompFiber(domFiber);
    for (let i = 0; i < traverseUp; i++) {
        compFiber = GetCompFiber(compFiber);
    }
    return compFiber.stateNode;
  }

  toggleNewEntryWorkflow = () => {
    this.setState({ showNewEntryWorkflow : !this.state.showNewEntryWorkflow, currentLogBookEntry : undefined });
  }

  setCurrentLogBookEntry = (logBookEntry) => {
    this.setState({ currentLogBookEntry : logBookEntry });
  }

  clearCurrentLogBookEntry = () => {
    this.setState({ currentLogBookEntry : undefined });
  }

  updateLogBookEntryById = (id) => {
    const { findReact } = this;
    const node = document.getElementById(`${id}`);
    const component = node && findReact(node);

    if (component) {
      return component.updateLogBookEntry();
    }
  }

  addEntry = (logBookEntry) => {
    const { storage } = this.props;
    const { entryIds } = this.state;

    logBookEntry.save(storage).then(() => {
      entryIds.unshift(logBookEntry.id);
      this.setState({ entryIds : entryIds.slice(), showNewEntryWorkflow : false });
    }, (error) => {
      console.error(error);
    })
  }

  editLogBookEntry = (logBookEntry) => {
    this.setState({ currentLogBookEntry : logBookEntry, showNewEntryWorkflow : true })
  }

  editLogBookEntryDate = (logBookEntry) => {
    this.setState({ editDateLogbookEntry : logBookEntry, currentLogBookEntry : undefined, showNewEntryWorkflow : false })
  }

  renderItem = ({ index, key, style }) => {
    const { deleteLogBookEntry, setCurrentLogBookEntry, editLogBookEntry, editLogBookEntryDate } = this;
    const { width, height, storage } = this.props;
    const { entryIds } = this.state;
    const logBookEntryId = entryIds[index];
    const elementStyle = Object.assign({}, style);
    elementStyle.height = `${height - 65 - 4}px`;

    return (
      <div className="logbook-entry-container" key={logBookEntryId} style={elementStyle}>
        <LogBookEntryPanel
          logBookEntryId={logBookEntryId}
          height={height - 65 - 25 - 4}
          width={width - 50}
          deleteLogBookEntry={deleteLogBookEntry}
          setCurrentLogBookEntry={setCurrentLogBookEntry}
          editLogBookEntry={editLogBookEntry}
          editLogBookEntryDate={editLogBookEntryDate}
          storage={storage} />
      </div>
    )
  }

  snapBackToOffset = (offset, delta) => {
    const { snapping } = this.state;
    const { listRef, snapBackToOffset } = this;
    const currentScrollOffset = listRef.current.state.scrollOffset;
    clearTimeout(this.snapScrollTimeout);

    if (currentScrollOffset > offset) {
      const animate = () => {
        listRef.current.scrollTo(currentScrollOffset - delta);

        this.snapScrollTimeout = setTimeout(() => {
          snapBackToOffset(offset, delta);
        }, 5)
      }

      if (!snapping) {
        this.setState({ snapping : true }, animate);
      } else {
        animate();
      }
    } else {
      this.setState({ snapping : false })
    }
  }

  snapForwardToOffset = (offset, delta) => {
    const { snapping } = this.state;
    const { listRef, snapForwardToOffset } = this;
    const currentScrollOffset = listRef.current.state.scrollOffset;
    clearTimeout(this.scrollTimeout);

    if (currentScrollOffset < offset) {
      const animate = () => {
        listRef.current.scrollTo(currentScrollOffset + delta);

        this.snapScrollTimeout = setTimeout(() => {
          snapForwardToOffset(offset, delta);
        }, 5)
      }

      if (!snapping) {
        this.setState({ snapping : true }, animate);
      } else {
        animate();
      }
    } else {
      this.setState({ snapping : false })
    }
  }

  onScroll = (opts) => {
    const { snapping } = this.state;
    const { listRef, scrollTimeout, snapScrollTimeout, snapBackToOffset, snapForwardToOffset } = this;
    const { width } = this.props;
    const { scrollDirection, scrollOffset } = opts;

    if (snapping) {
      return;
    }

    clearTimeout(scrollTimeout);
    clearTimeout(snapScrollTimeout);

    switch(scrollDirection) {
      case 'forward':
        this.scrollTimeout = setTimeout(() => {
          const desiredItem = Math.ceil(scrollOffset / width);
          const desiredScrollOffset = width * desiredItem;
          snapForwardToOffset(desiredScrollOffset, Math.abs(listRef.current.state.scrollOffset - desiredScrollOffset) / 10);
        }, 100);
      break;
      case 'backward':
        this.scrollTimeout = setTimeout(() => {
          const desiredItem = Math.floor(scrollOffset / width);
          const desiredScrollOffset = width * desiredItem;
          snapBackToOffset(desiredScrollOffset, Math.abs(listRef.current.state.scrollOffset - desiredScrollOffset) / 10);
        }, 100);
      break;
    }
  }

  deleteLogBookEntry = (logBookEntry) => {
    const { entryIds } = this.state;
    const idx = entryIds.indexOf(logBookEntry.id);

    if (idx >= 0) {
      entryIds.splice(idx, 1);
      this.setState({ entryIds : entryIds.slice() });
    }
  }

  selectLogBookEntryDate = (selected) => {
    const { storage } = this.props;
    const { editDateLogbookEntry } = this.state;
    editDateLogbookEntry.date = DateTime.fromJSDate(selected);

    this.updateLogBookEntryById(editDateLogbookEntry.id).then(() => {
      this.closeCalendar();
    });
  }

  closeCalendar = () => {
    this.setState({ editDateLogbookEntry : undefined, currentLogBookEntry : undefined, showNewEntryWorkflow : false })
  }

  render() {
    const { toggleNewEntryWorkflow, clearCurrentLogBookEntry, addEntry, renderItem, onScroll, updateLogBookEntryById, updateLogBook, selectLogBookEntryDate, closeCalendar } = this;
    const { app, width, height, storage } = this.props;
    const { showNewEntryWorkflow, currentLogBookEntry, editDateLogbookEntry, entryIds } = this.state;

    const headerCaption = entryIds.length > 0 ? `${entryIds.length} entries` : '';

    return (
      <div className="logbook" style={{ width : `${width}px`, height : `${height}px` }}>
        <div className="header">
          <div className="spacer" />
          <div className="logbook-entry-count"><div>{headerCaption}</div></div>
          <div className="btn ripple plus" onClick={toggleNewEntryWorkflow}><FontAwesomeIcon icon={faPlus} className="icon" /></div>
        </div>
        {entryIds.length === 0 && <div className="start-here">
          <div className="pointer"><FontAwesomeIcon icon={faHandPointRight} /></div>
          <div className="caption">This is your logbook</div>
          <div className="caption">tap the plus to add a new logbook entry!</div>
        </div>}
        <List
          ref={this.listRef}
          className="entries"
          height={height - 65 - 25 - 4}
          itemCount={entryIds.length}
          itemSize={width}
          layout="horizontal"
          width={width}
          onScroll={onScroll}
        >
          {renderItem}
        </List>
        <div className={`logbook-entry-date-selector ${editDateLogbookEntry ? 'show' : 'hide' }`} style={{ width : `${width}px`, height : `${height - 35}px` }}>
          <div className="close ripple" onClick={closeCalendar}><FontAwesomeIcon icon={faTimes} /></div>
          {editDateLogbookEntry && <InfiniteCalendar
            width={width}
            height={height - 185}
            selected={editDateLogbookEntry && editDateLogbookEntry.date.toJSDate()}
            onSelect={selectLogBookEntryDate}
            theme={CALENDAR_THEME}
          />}
        </div>
        <EntryWorkflow width={width} height={height} show={showNewEntryWorkflow} cancelEntry={toggleNewEntryWorkflow} storage={storage} addEntry={addEntry} logBookEntry={currentLogBookEntry} updateLogBookEntryById={updateLogBookEntryById} updateLogBook={updateLogBook} />
        <AddRiderWorkflow width={width} height={height} show={!!currentLogBookEntry && !showNewEntryWorkflow} cancelEntry={clearCurrentLogBookEntry} storage={storage} logBookEntry={currentLogBookEntry} updateLogBookEntryById={updateLogBookEntryById} updateLogBook={updateLogBook} />
      </div>
  	);
  }
}

export default LogBookPanel;
