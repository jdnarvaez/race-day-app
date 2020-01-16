import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { FixedSizeList as List } from 'react-window';

import LogBookEntry from '../../model/LogBookEntry';
import RaceResult from './RaceResult';

import './RaceResultsPanel.css';

class RaceResultsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entryIds : []
    }

    this.listRef = React.createRef();
  }

  componentDidMount() {
    const { updateEntryIds } = this;
    updateEntryIds();
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateEntryIds } = this;

    if (prevProps.activePanel !== this.props.activePanel && this.props.activePanel) {
      updateEntryIds();
    }
  }

  updateEntryIds = () => {
    const { storage } = this.props;

    LogBookEntry.allIds(storage).then(entryIds => {
      this.setState({ entryIds });
    })
  }

  renderItem = ({ index, key, style }) => {
    const { width, height, storage } = this.props;
    const { entryIds } = this.state;
    const logBookEntryId = entryIds[index];
    const elementStyle = Object.assign({}, style);
    elementStyle.height = `${100}px`;

    return (
      <div className="race-result-container" key={logBookEntryId} style={elementStyle}>
        <RaceResult width={width - 50} height={100} logBookEntryId={logBookEntryId} storage={storage} />
      </div>
    )
  }

  render() {
    const { renderItem} = this;
    const { app, width, height, storage } = this.props;
    const { entryIds } = this.state;

    const tabWidth = window.cordova ? innerWidth / 6 : innerWidth / 5;
    const tabOffset = window.cordova ? 3 : 2;

    return (
      <div className="race-results-panel" style={{ width : `${width}px`, height : `${height}px` }}>
        {entryIds.length === 0 && <div className="start-here">
          <div className="caption">these are your race results</div>
          <div className="caption">tap here to start logging!</div>
          <div className="pointer" style={{ marginLeft : `${tabOffset * tabWidth}px`, width : `${tabWidth}px` }}><FontAwesomeIcon icon={faHandPointRight} /></div>
        </div>}
        {entryIds.length > 0 && <div className="race-results-count">{`${entryIds.length} races`}</div>}
        {entryIds.length > 0 && <List
          ref={this.listRef}
          className="race-results"
          height={height - 35}
          itemCount={entryIds.length}
          itemSize={110}
          layout="vertical"
          width={width}
        >
          {renderItem}
        </List>}
      </div>
  	);
  }
}

export default RaceResultsPanel;
