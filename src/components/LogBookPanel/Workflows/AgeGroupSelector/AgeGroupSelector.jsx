import React from 'react';
import { DateTime, Duration } from 'luxon';
import { LatLng } from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faPlus } from '@fortawesome/free-solid-svg-icons';
import USABMX from '../../../../services/USABMX';
const age_groups = require('../../../../model/age_groups.json');

import './AgeGroupSelector.css';

class AgeGroupSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  selectAgeGroup = (e, ageGroup) => {
    const { logBookEntry, entry, onSelect } = this.props;
    entry.ageGroup = ageGroup;
    onSelect(e, logBookEntry);
  }

  render() {
    const { selectAgeGroup } = this;
    const { app, width, height, logBookEntry, entry } = this.props;

    return (
      <div className={`age-group-selector`} style={{ height : `${height}px` }}>
        <div className="age-groups" style={{ height : `${height - 50 - 45}px` }}>
          {age_groups.map(ageGroup => {
            return (
              <div className={`age-group ripple ${ageGroup === entry.ageGroup? 'selected' : ''}`} key={ageGroup} onClick={(e) => selectAgeGroup(e, ageGroup)}>
                <div className="name">{ageGroup}</div>
              </div>
            )
          })}
        </div>
      </div>
  	);
  }
}

export default AgeGroupSelector;
