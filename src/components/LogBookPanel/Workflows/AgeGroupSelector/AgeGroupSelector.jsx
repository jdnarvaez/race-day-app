import React from 'react';
import { DateTime } from 'luxon';
const all_age_groups = require('../../../../model/age_groups.json');

import './AgeGroupSelector.css';

class AgeGroupSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      age_groups : all_age_groups
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activePanel !== this.props.activePanel && this.props.activePanel) {
      const { storage, entry } = this.props;
      const next_age_groups = all_age_groups.slice();

      if (entry.rider && entry.rider.serial_number) {
        storage.getRiderInfoBySerial(entry.rider.serial_number).then(info => {
          if (!info) {
            return  this.setState({ age_groups : next_age_groups });
          }

          const { proficiency_class, proficiency_cruiser, gender, date_of_birth } = info;
          const age = Math.abs(parseInt(DateTime.fromISO(date_of_birth).diffNow().as('years')));
          const computed_class = `${age} ${proficiency_class}`;
          const computed_cruiser = `${age} ${proficiency_cruiser}`;

          all_age_groups.forEach(age_group => {
            if (gender === 'M' && (age_group.indexOf('Women') > -1 || age_group.indexOf('Girls') > -1)) {
              return;
            }

            // Age Range
            if (age_group.indexOf('-') > -1) {
              const lower_bound = parseInt(age_group.split('-')[0]);
              const upper_bound = parseInt(age_group.split('-')[1].split(' ')[0]);

              if (age >= lower_bound && age <= upper_bound && (age_group.indexOf(proficiency_class) > -1 || age_group.indexOf(proficiency_cruiser) > -1)) {
                next_age_groups.unshift(age_group);
              }
            } else {
              if (age_group === computed_class || age_group === computed_cruiser) {
                next_age_groups.unshift(age_group);
              }
            }
          })

          this.setState({ age_groups : next_age_groups });
        }).catch((err) => {
          console.error(err);
          this.setState({ age_groups : next_age_groups });
        })
      }
    }
  }

  selectAgeGroup = (e, ageGroup) => {
    const { logBookEntry, entry, onSelect } = this.props;
    entry.ageGroup = ageGroup;
    onSelect(e, logBookEntry);
  }

  render() {
    const { selectAgeGroup } = this;
    const { age_groups } = this.state;
    const { app, width, height, logBookEntry, entry } = this.props;

    return (
      <div className={`age-group-selector`} style={{ height : `${height}px` }}>
        <div className="age-groups" style={{ height : `${height - 50 - 45}px` }}>
          {age_groups.map((ageGroup, idx) => {
            return (
              <div className={`age-group ripple ${ageGroup === entry.ageGroup? 'selected' : ''}`} key={`${ageGroup} ${idx.toString()}`} onClick={(e) => selectAgeGroup(e, ageGroup)}>
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
