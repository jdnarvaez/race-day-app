import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swipeout from 'rc-swipeout';

import { Input } from '../../../Input';
import USABMX from '../../../../services/USABMX';

import './RiderSelector.css';

class RiderSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      riderName : '',
      riders : []
    }
  }

  componentDidMount() {
    const { updateRiderList } = this;
    updateRiderList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateRiderList } = this;

    if (prevProps.activePanel !== this.props.activePanel) {
      updateRiderList();
    }
  }

  updateRiderList = () => {
    const { storage } = this.props;

    storage.riders().then((riders) => {
      this.setState({ riders });
    })
  }

  selectRider = (e, rider) => {
    const { logBookEntry, entry, onSelect } = this.props;
    entry.rider = rider;
    onSelect(e, logBookEntry);
  }

  scanCard = () => {
    const { storage } = this.props;

    cordova.plugins.barcodeScanner.scan((result) => {
      if (!result.cancelled && result.text && result.format) {
          const serial = result.text;

          if (serial.trim() !== '') {
            storage.getRiderInfoBySerial(serial).then((info) => {
              storage.getRiderBySerial(serial).then((rider) => {
                this.setState({ riderName : '' }, () => {
                  this.selectRider(undefined, rider);
                });
              }).catch((err) => {
                console.error(err);
              })
            });
          }
        }
      }, (error) => {
        console.error(error);
      },
      {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: true, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt : "Place a USA BMX membership card inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        disableAnimations : false, // iOS
        disableSuccessBeep: false // iOS and Android
      }
   );
  }

  changeValue = (event) => {
    const value = event.target.value;
    this.setState({ riderName : value });
  }

  handleKeyPress = (event) => {
    const { storage } = this.props;

    if (event.which === 13) {
      event.target.blur();

      storage.findRiderByName(this.state.riderName.trim()).then((riders) => {
        const rider = riders && riders[0];

        if (rider) {
          this.setState({ riderName : '' }, () => {
            this.selectRider(undefined, rider);
          });
        } else {
          storage.addRider(this.state.riderName.trim()).then((rider) => {
            storage.riders().then(riders => {
              this.setState({ riders : riders, riderName : '' }, () => {
                this.selectRider(undefined, rider);
              });
            })
          })
        }
      })
    }
  }

  deleteRider = (rider) => {
    const { storage, updateLogBook } = this.props;

    storage.deleteRiderById(rider.id).then(() => {
      const { riders } = this.state;
      riders.splice(riders.indexOf(rider), 1);
      this.setState({ riders : riders.slice() }, () => {
        updateLogBook();
      });
    }, (error) => {
      console.error(error);
    })
  }

  render() {
    const { addRider, deleteRider, selectRider, scanCard, changeValue, handleKeyPress } = this;
    const { app, width, height, logBookEntry, entry } = this.props;
    const { riders } = this.state;

    return (
      <div className={`rider-selector`} style={{ height : `${height}px` }}>
        <div className="header">
          <div className="name-input">
            <Input
              label="Enter a new Rider's Name"
              locked={false}
              active={false}
              type="text"
              onChange={changeValue}
              onKeyPress={handleKeyPress}
              value={this.state.riderName}
            />
          </div>
          <div className="btn ripple" onClick={scanCard}><FontAwesomeIcon icon={faBarcode} /></div>
        </div>
        <div className="riders" style={{ height : `${height - 50 - 45}px` }}>
          {riders.length === 0 &&
            <div className={`rider`} key={'no-riders-found'}>
              <div className="name">no riders found</div>
            </div>
          }
          {riders.map(rider => {
            return (
              <Swipeout
                key={rider.id.toString()}
                autoClose={true}
                right={[
                  {
                    text : 'delete',
                    onPress : (e) => { deleteRider(rider) },
                    style : { backgroundColor: 'rgba(var(--danger-color), .5)', color : 'rgba(var(--foreground-color), 1)' },
                  }
                ]}>
                <div className={`rider ripple ${rider.id === entry.rider.id ? 'selected' : ''}`} key={rider.id.toString()} onClick={(e) => selectRider(e, rider)}>
                  <div className="name">{rider.name}</div>
                </div>
              </Swipeout>
            )
          })}
        </div>
      </div>
  	);
  }
}

export default RiderSelector;
