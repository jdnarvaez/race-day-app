import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { FixedSizeList as List } from 'react-window';

import LogBookEntry from '../../model/LogBookEntry';
import Rider from '../../model/Rider';
import RiderResult from './RiderResult';

import './RiderResultsPanel.css';

class RiderResultsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      riders : []
    }

    this.listRef = React.createRef();
  }

  componentDidMount() {
    this._mounted = true;
    const { activePanel } = this.props;
    const { retrieveRiders } = this;

    if (activePanel) {
      retrieveRiders();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { retrieveRiders } = this;

    if (prevProps.activePanel !== this.props.activePanel && this.props.activePanel) {
      retrieveRiders();
    }
  }

  retrieveRiders = () => {
    const { storage } = this.props;

    Rider.all(storage).then(riders => {
      if (!this._mounted) {
        return;
      }

      this.setState({ riders });
    })
  }

  renderItem = ({ index, key, style }) => {
    const { width, height, storage } = this.props;
    const { riders } = this.state;
    const rider = riders[index];
    const elementStyle = Object.assign({}, style);
    elementStyle.height = `${425}px`;

    return (
      <div className="rider-result-container" key={rider.id} style={elementStyle}>
        <RiderResult width={width - 50} height={425} rider={rider} storage={storage} />
      </div>
    )
  }

  render() {
    const { renderItem} = this;
    const { app, width, height, storage } = this.props;
    const { riders } = this.state;

    const tabWidth = window.cordova ? innerWidth / 5 : innerWidth / 4;
    const tabOffset = window.cordova ? 3 : 2;

    if (!this.props.activePanel) {
      return null;
    }

    return (
      <div className="rider-results-panel" style={{ width : `${width}px`, height : `${height}px` }}>
        {riders.length === 0 && <div className="start-here">
          <div className="caption">these are your race results</div>
          <div className="caption">tap here to start logging!</div>
          <div className="pointer" style={{ marginLeft : `${tabOffset * tabWidth}px`, width : `${tabWidth}px` }}><FontAwesomeIcon icon={faHandPointRight} /></div>
        </div>}
        {riders.length > 0 && <div className="rider-results-count">{`${riders.length} ${riders.length > 1 ? 'riders' : 'rider' }`}</div>}
        {riders.length > 0 && <List
          ref={this.listRef}
          className="rider-results"
          height={height - 35}
          itemCount={riders.length}
          itemSize={435}
          layout="vertical"
          width={width}
        >
          {renderItem}
        </List>}
      </div>
  	);
  }
}

export default RiderResultsPanel;
