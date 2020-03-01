import React from 'react';
import ReactDOM from 'react-dom';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faPercent, faMapMarkerAlt, faMapMarkedAlt, faFlagUsa, faTrophy } from '@fortawesome/free-solid-svg-icons';

import LogBookEntry from '../../../model/LogBookEntry';
import RiderStat from './RiderStat';
import LoadingIndicator from '../../LoadingIndicator';

import './RiderResult.css';

// Points tables based on 2020 Rulebook

const NOVICE_TABLE = [0, 25, 20, 15, 12, 10, 7, 5, 3];
const INTERMEDIATE_TABLE = [0, 50, 40, 30, 25, 20, 15, 10, 5];
const EXPERT_TABLE = [0, 100, 80, 60, 50, 40, 30, 20, 10];

const STATE_GOLDCUP_NOVICE_TABLE = [10, 18, 17, 16, 15, 14, 13, 12, 11];
const STATE_GOLDCUP_INTERMEDIATE_TABLE = [10, 19, 18, 17, 16, 15, 14, 13, 12];
const STATE_GOLDCUP_EXPERT_TABLE = [10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 13];

const NATIONAL_NOVICE_TABLE = [0, 60, 50, 40, 30, 20, 10, 8, 5];
const NATIONAL_INTERMEDIATE_TABLE = [0, 120, 100, 80, 60, 40, 20, 15, 10];
const NATIONAL_EXPERT_TABLE = [0, 240, 200, 160, 120, 80, 40, 30, 20];

// whats important about the result? the rider, date, class, race name, location, whether or not its posted, poduium or win?
class RiderResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.retrieveRiderData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.logBookEntryId !== prevProps.logBookEntryId) {
      this.retrieveRiderData();
    }
  }

  retrieveRiderData = () => {
    const currentYear = new DateTime.fromJSDate(new Date()).year;
    const { storage, rider } = this.props;

    var classDistrictPoints = 0;
    var classNationalPoints = 0;
    var classStatePoints = 0;
    var classGoldCupPoints = 0;
    var cruiserDistrictPoints = 0;
    var cruiserNationalPoints = 0;
    var cruiserStatePoints = 0;
    var cruiserGoldCupPoints = 0;
    var wins = 0;
    var totalRaces = 0;

    LogBookEntry.forRider(storage, rider.id).then(entries => {
      entries.filter(e => e.pointsClass.id !== 0 && e.date.year === currentYear).forEach(logBookEntry => {
        const { pointsClass, riderEntries, category } = logBookEntry;
        const isNational = category === 'National';
        const isState = category === 'State';
        const isGoldCup = category === 'Gold Cup';

        // TOOO: Multi Points for GC / STATE Finals
        // Bonus Points
        riderEntries.filter(e => e.rider.id === rider.id).forEach(entry => {
          const { ageGroup } = entry;
          var totalRiders = 0;

          try {
            totalRiders = parseInt(entry.totalRiders);
          } catch (error) {}

          if (isNaN(totalRiders)) {
            totalRiders = 0;
          }

          totalRaces++;

          const main = entry.motos.find(moto => moto.name === 'main');
          const finish = (main.finish === '' || main.finish === null || main.finish === undefined) ? 0 : parseInt(main.finish)

          if (finish === 1) {
            wins++;
          }

          if (!ageGroup || ageGroup.trim() === '' || ageGroup.toLowerCase().indexOf('open') > -1) {
            return;
          }

          const pointsGroup = ageGroup.toLowerCase();

          // Based on 2020 Rulebook
          if (pointsGroup.indexOf('cruiser') > -1) {
            if (isNational) {
              cruiserNationalPoints += (NATIONAL_EXPERT_TABLE[finish] + totalRiders);
            }

            if (isState) {
              cruiserStatePoints += STATE_GOLDCUP_EXPERT_TABLE[finish];
            }

            if (isGoldCup) {
              cruiserGoldCupPoints += STATE_GOLDCUP_EXPERT_TABLE[finish];
            }

            cruiserDistrictPoints += ((EXPERT_TABLE[finish] + totalRiders) * pointsClass.id);
          } else {
            var pointsTable;
            var nationalPointsTable;
            var stateGoldCupTable;

            if (pointsGroup.indexOf('women') > -1 || pointsGroup.indexOf('girl') > -1 || pointsGroup.indexOf('expert') > -1) {
              pointsTable = EXPERT_TABLE;
              nationalPointsTable = NATIONAL_EXPERT_TABLE;
              stateGoldCupTable = STATE_GOLDCUP_EXPERT_TABLE;
            } else if (pointsGroup.indexOf('intermediate')) {
              pointsTable = INTERMEDIATE_TABLE;
              nationalPointsTable = NATIONAL_INTERMEDIATE_TABLE;
              stateGoldCupTable = STATE_GOLDCUP_INTERMEDIATE_TABLE;
            } else {
              pointsTable = NOVICE_TABLE;
              nationalPointsTable = NATIONAL_NOVICE_TABLE;
              stateGoldCupTable = STATE_GOLDCUP_NOVICE_TABLE;
            }

            if (isNational) {
              classNationalPoints += (nationalPointsTable[finish] + totalRiders);
            }

            if (isState) {
              classStatePoints += stateGoldCupTable[finish];
            }

            if (isGoldCup) {
              classGoldCupPoints += stateGoldCupTable[finish];
            }

            classDistrictPoints += ((pointsTable[finish] + totalRiders) * pointsClass.id);
          }
        })
      })

      const winPercentage = Math.round((((wins / totalRaces) * 100) + Number.EPSILON) * 10) / 10;

      this.setState({
        wins : wins,
        winPercentage : winPercentage,
        classDistrictPoints : classDistrictPoints,
        classNationalPoints : classNationalPoints,
        cruiserDistrictPoints : cruiserDistrictPoints,
        cruiserNationalPoints : cruiserNationalPoints,
        classStatePoints : classStatePoints,
        classGoldCupPoints : classGoldCupPoints,
        cruiserStatePoints : cruiserStatePoints,
        cruiserGoldCupPoints : cruiserGoldCupPoints,
      })
    })
  }

  render() {
    const { width, height, rider } = this.props;
    const {
      wins,
      winPercentage,
      classDistrictPoints,
      classStatePoints,
      classGoldCupPoints,
      classNationalPoints,
      cruiserDistrictPoints,
      cruiserNationalPoints,
      cruiserStatePoints,
      cruiserGoldCupPoints
    } = this.state;

    const loading = wins === undefined;

    return (
      <div className="rider-result" style={{ width : `${width}px`, height : `${height}px` }}>
        <div className="name">{rider.name}</div>
        {!loading && <div className="stats">
          <div className="stats-row">
            <RiderStat icon={faMedal} label={'wins'} value={wins} />
            <RiderStat icon={faPercent} label={'win percentage'} value={isNaN(winPercentage) ? 0 : winPercentage} />
          </div>
          <div className="divider">class</div>
          <div className="stats-row">
            <RiderStat icon={faMapMarkerAlt} label={'district points'} subtitle={'class'} value={classDistrictPoints} />
            <RiderStat icon={faFlagUsa} label={'national points'} subtitle={'class'} value={classNationalPoints} />
          </div>
          <div className="stats-row">
            <RiderStat icon={faMapMarkedAlt} label={'state points'} subtitle={'class'} value={classStatePoints} />
            <RiderStat icon={faTrophy} label={'gold cup points'} subtitle={'class'} value={classGoldCupPoints} />
          </div>
          <div className="divider">cruiser</div>
          <div className="stats-row">
            <RiderStat icon={faMapMarkerAlt} label={'district points'} subtitle={'cruiser'} value={cruiserDistrictPoints} />
            <RiderStat icon={faFlagUsa} label={'national points'} subtitle={'cruiser'} value={cruiserNationalPoints} />
          </div>
          <div className="stats-row">
            <RiderStat icon={faMapMarkedAlt} label={'state points'} subtitle={'class'} value={cruiserStatePoints} />
            <RiderStat icon={faTrophy} label={'gold cup points'} subtitle={'class'} value={cruiserGoldCupPoints} />
          </div>
        </div>}
      </div>
  	);
  }
}

export default RiderResult;
