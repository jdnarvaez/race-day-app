import React from 'react';
import ReactDOM from 'react-dom';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faPercent, faMapMarkerAlt, faMapMarkedAlt, faFlagUsa, faTrophy, faStar } from '@fortawesome/free-solid-svg-icons';

import LogBookEntry from '../../../model/LogBookEntry';
import RiderStat from './RiderStat';
import LoadingIndicator from '../../LoadingIndicator';
import MainPanel from '../../MainPanel';

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

// const details = '[{"id":97227958,"0":97227958,"bmx_member_id":300865,"1":300865,"aba_number":"12923930","2":"12923930","points_type":"District","3":"District","district":"AZ02","4":"AZ02","points_class":"Boys","5":"Boys","skill":"Expert","6":"Expert","age_group":"11 Expert","7":"11 Expert","place":3,"8":3,"points":1622,"9":1622,"team":null,"10":null,"wins":0,"11":0,"date_of_birth":null,"12":null,"lastwin":null,"13":null,"single":"17","14":"17","state_races":"0","15":"0","created_at":"2020-03-08 08:14:03.117391","16":"2020-03-08 08:14:03.117391","updated_at":"2020-03-08 08:14:03.117391","17":"2020-03-08 08:14:03.117391","state":null,"18":null,"age":null,"19":null,"bmx_age_group_id":null,"20":null,"points_subclass":null,"21":null,"can_order_jacket":false,"22":false,"region":null,"23":null,"season":"2020","24":"2020"},{"id":97241954,"0":97241954,"bmx_member_id":300865,"1":300865,"aba_number":"12923930","2":"12923930","points_type":"State","3":"State","district":"AZ02","4":"AZ02","points_class":"Boys","5":"Boys","skill":"Expert","6":"Expert","age_group":"11 Expert","7":"11 Expert","place":6,"8":6,"points":18,"9":18,"team":null,"10":null,"wins":0,"11":0,"date_of_birth":null,"12":null,"lastwin":null,"13":null,"single":"17","14":"17","state_races":"1","15":"1","created_at":"2020-03-08 08:17:40.646194","16":"2020-03-08 08:17:40.646194","updated_at":"2020-03-08 08:17:40.646194","17":"2020-03-08 08:17:40.646194","state":"AZ","18":"AZ","age":null,"19":null,"bmx_age_group_id":null,"20":null,"points_subclass":null,"21":null,"can_order_jacket":false,"22":false,"region":"AZ","23":"AZ","season":"2020","24":"2020"},{"id":97246186,"0":97246186,"bmx_member_id":300865,"1":300865,"aba_number":"12923930","2":"12923930","points_type":"U.S. N.A.G.","3":"U.S. N.A.G.","district":"AZ02","4":"AZ02","points_class":"Boys","5":"Boys","skill":"Expert","6":"Expert","age_group":"11 Boys","7":"11 Boys","place":98,"8":98,"points":146,"9":146,"team":null,"10":null,"wins":0,"11":0,"date_of_birth":null,"12":null,"lastwin":null,"13":null,"single":"0","14":"0","state_races":"0","15":"0","created_at":"2020-03-08 08:18:45.736888","16":"2020-03-08 08:18:45.736888","updated_at":"2020-03-08 08:18:45.736888","17":"2020-03-08 08:18:45.736888","state":null,"18":null,"age":null,"19":null,"bmx_age_group_id":null,"20":null,"points_subclass":null,"21":null,"can_order_jacket":false,"22":false,"region":null,"23":null,"season":"2020","24":"2020"},{"id":97250906,"0":97250906,"bmx_member_id":300865,"1":300865,"aba_number":"12923930","2":"12923930","points_type":"U.S. National","3":"U.S. National","district":"AZ02","4":"AZ02","points_class":"Boys","5":"Boys","skill":"Expert","6":"Expert","age_group":"11 Expert","7":"11 Expert","place":1305,"8":1305,"points":146,"9":146,"team":null,"10":null,"wins":0,"11":0,"date_of_birth":null,"12":null,"lastwin":null,"13":null,"single":"0","14":"0","state_races":"0","15":"0","created_at":"2020-03-08 08:19:56.332707","16":"2020-03-08 08:19:56.332707","updated_at":"2020-03-08 08:19:56.332707","17":"2020-03-08 08:19:56.332707","state":null,"18":null,"age":null,"19":null,"bmx_age_group_id":null,"20":null,"points_subclass":null,"21":null,"can_order_jacket":false,"22":false,"region":null,"23":null,"season":"2020","24":"2020"}]';

// whats important about the result? the rider, date, class, race name, location, whether or not its posted, poduium or win?
class RiderResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      racerDetails : undefined,
      loadingUsaBmxData : true,
      activePanelIndex : 0
    };
  }

  componentDidMount() {
    this.retrieveRiderData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.logBookEntryId !== prevProps.logBookEntryId) {
      this.retrieveRiderData();
    }
  }

  tabulatePoints = (rider, rider_info) => {
    const currentYear = new DateTime.fromJSDate(new Date()).year;
    const { storage } = this.props;
    let proficiency_class;
    let proficiency_cruiser;

    if (rider_info) {
      proficiency_cruiser = rider_info.proficiency_cruiser.toLowerCase();
      proficiency_class = rider_info.proficiency_class.toLowerCase();
    }

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

            // Award highest level points to rider if they are riding down a proficiency
            if ((proficiency_class && (proficiency_class.indexOf('expert') > -1 ||
                proficiency_class.indexOf('women') > -1 ||
                proficiency_class.indexOf('girls') > -1)) ||
                pointsGroup.indexOf('women') > -1 ||
                pointsGroup.indexOf('girl') > -1 ||
                pointsGroup.indexOf('expert') > -1) {
              pointsTable = EXPERT_TABLE;
              nationalPointsTable = NATIONAL_EXPERT_TABLE;
              stateGoldCupTable = STATE_GOLDCUP_EXPERT_TABLE;
            } else if ((proficiency_class && proficiency_class.indexOf('intermediate') > -1) || pointsGroup.indexOf('intermediate') > -1) {
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

  retrieveRiderData = () => {
    const { tabulatePoints, retriveRiderPoints } = this;
    const { storage, rider } = this.props;

    if (rider.serial_number) {
      storage.getRiderInfoBySerial(rider.serial_number).then(info => {
        retriveRiderPoints(info);
        return tabulatePoints(rider, info);
      }).catch((err) => {
        console.error(err);
        return tabulatePoints(rider);
      })
    } else {
      tabulatePoints(rider);
    }
  }

  retriveRiderPoints = (info) => {
    const { storage } = this.props;
    storage.getRacerDetailsByMemberId(info.id).then(racerDetails => this.setState({ racerDetails : racerDetails }));
  }

  render() {
    const { width, height, rider, rider_info } = this.props;

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
      cruiserGoldCupPoints,
      activePanelIndex,
      racerDetails
    } = this.state;

    const loading = wins === undefined;

    return (
      <div className="rider-result" style={{ width : `${width}px`, height : `${height}px` }}>
        <div className="name">{rider.name}</div>
        <div className="tabs">
          <div className={`tab ${activePanelIndex === 0 ? 'active' : ''}`} onClick={() => this.setState({ activePanelIndex : 0 })}>Logged</div>
          <div className={`tab ${activePanelIndex === 1 ? 'active' : ''}`} onClick={() => this.setState({ activePanelIndex : 1 })}>Posted</div>
        </div>
        <MainPanel activePanelIndex={activePanelIndex} width={width - 25} height={height - 91}>
          <React.Fragment>
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
          </React.Fragment>
          <React.Fragment>
            {!racerDetails && <div className="divider" style={{ width : `${width - 25}px`}}>no points found</div>}
            {racerDetails && <div className="details">
              <div className="divider" style={{ width : `${width - 25}px`}}>rankings</div>
              {racerDetails.map(details => {
                var icon;

                switch (details.points_type) {
                  case "District":
                    icon = faMapMarkerAlt;
                    break;
                  case "State":
                    icon = faMapMarkedAlt;
                    break;
                  case "U.S. N.A.G.":
                  case "U.S. National":
                    icon = faFlagUsa;
                    break;
                  case "Gold Cup":
                    icon = faTrophy;
                    break;
                  default:
                    icon = faStar;
                    break;
                }

                return (
                  <RiderStat icon={icon} label={`${details.points_type}`} value={details.place} style={{ width : `${(width - 25) / 2}px`}} />
                )
              })}
              <div className="divider" style={{ marginTop : '10px', width : `${width - 25}px`}}>points</div>
              {racerDetails.map(details => {
                var icon;

                switch (details.points_type) {
                  case "District":
                    icon = faMapMarkerAlt;
                    break;
                  case "State":
                    icon = faMapMarkedAlt;
                    break;
                  case "U.S. N.A.G.":
                  case "U.S. National":
                    icon = faFlagUsa;
                    break;
                  case "Gold Cup":
                    icon = faTrophy;
                    break;
                  default:
                    icon = faStar;
                    break;
                }

                return (
                  <RiderStat icon={icon} label={`${details.points_type}`} value={details.points} style={{ width : `${(width - 25) / 2}px`}} />
                )
              })}
            </div>}
          </React.Fragment>
        </MainPanel>
      </div>
  	);
  }
}

export default RiderResult;
