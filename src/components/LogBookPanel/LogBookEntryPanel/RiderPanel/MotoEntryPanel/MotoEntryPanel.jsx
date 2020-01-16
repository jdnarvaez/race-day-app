import React from 'react';
import { DateTime } from 'luxon';

import './MotoEntryPanel.css';

class MotoEntryPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locked : false
    }
  }

  changeMotoNumber = (moto, number) => {
    const { updateLogBookEntry } = this.props;
    moto.number = number;
    updateLogBookEntry();
  }

  changeMotoFinish = (moto, number) => {
    const { updateLogBookEntry } = this.props;
    moto.finish = number.substring(number.length - 1, number.length);

    if (moto.finish === '9') {
      moto.finish = '';
    }

    updateLogBookEntry();
  }

  handleKeyPress = (event) => {
    if (event.which === 13) {
      event.target.blur();
    }
  }

  render() {
    const { changeMotoNumber, changeMotoFinish, handleKeyPress } = this;
    const { moto, selectMoto, mapMotoName } = this.props;

    return (
      <div className="round">
        <div className="title" dangerouslySetInnerHTML={{ __html : mapMotoName(moto.name) }} onClick={(e) => selectMoto(moto)} />
        <div className={`number`}>
          <input
            type="number"
            value={moto.number}
            placeholder={`#`}
            onChange={(e) => { changeMotoNumber(moto, e.target.value) }}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className={`finish`}>
          <input
            type="number"
            value={moto.finish}
            placeholder={`place`}
            onChange={(e) => { changeMotoFinish(moto, e.target.value) }}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
  	);
  }
}

export default MotoEntryPanel;
