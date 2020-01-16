import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHandPointRight } from '@fortawesome/free-solid-svg-icons';

import LogBookEntry from '../../../model/LogBookEntry';

import './RaceResult.css';

// whats important about the result? the rider, date, class, race name, location, whether or not its posted, poduium or win?
class RaceResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    const { width, height } = this.props;
    const { logBookEntry } = this.state;

    return (
      <div className="race-result" style={{ width : `${width}px`, height : `${height}px` }}>
        {logBookEntry && <div className="day">
          <div className="caption">{logBookEntry.date.toLocaleString({ weekday : 'long' })}</div>
        </div>}
      </div>
  	);
  }
}

export default RaceResult;
