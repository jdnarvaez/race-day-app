import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faPlus } from '@fortawesome/free-solid-svg-icons';
import Toggle from 'react-toggle'

import './LogBookPanel.css';

// TODO: AWARD TYPE, NOTES, PHOTO OF MOTOSHEET, CLASS/pROFICIENCY, RIDER COUNT, ENTRY FEE?, search functionality, track selector, etc
//move posted to usabmx to footer, rider count
// look into using tesseract to parse motosheets
//how many transfers per round?
// weather conditions
// swipe to delete if necessary
// borders based on race type maybe change header colors
class LogBookEntry extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      locked : false
    }
  }

  render() {
    const { race } = this.props;

    return (
      <div className="entry" style={{ height : `${this.props.height}px`}}>
        <div className="header">
          <div className="title">MO State Final</div>
          <div className="track">blue springs bmx</div>
          <div className="date">August 20, 2019</div>
          <div className="day">SUNDAY</div>
          <div className="category">state</div>
          <div className="points">triple points</div>
        </div>
        <div className="riders">
          <div className="rider">
            <div className="header">
              <div className="name">Juan Narvaez</div>
              <div className="proficiency">class</div>
              <div className="add-rider"><FontAwesomeIcon icon={faPlus} className="icon" /></div>
            </div>
            <div className="motos">
              <div className="rounds">
                <div className="round">
                  <div className="title">moto 1</div>
                  <div className="number"></div>
                  <div className="finish"></div>
                </div>
                <div className="round">
                  <div className="title">moto 2</div>
                  <div className="number"></div>
                  <div className="finish"></div>
                </div>
                <div className="round">
                  <div className="title fraction"><sup>1</sup>/<sub>16</sub></div>
                  <div className="number"></div>
                  <div className="finish"></div>
                </div>
                <div className="round">
                  <div className="title fraction"><sup>1</sup>/<sub>8</sub></div>
                  <div className="number"></div>
                  <div className="finish"></div>
                </div>
                <div className="round">
                  <div className="title fraction"><sup>1</sup>/<sub>4</sub></div>
                  <div className="number"></div>
                  <div className="finish"></div>
                </div>
                <div className="round">
                  <div className="title">semi</div>
                  <div className="number"></div>
                  <div className="finish"></div>
                </div>
                <div className="round">
                  <div className="title">main</div>
                  <div className="number"></div>
                  <div className="finish"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="submitted">
            <div className="caption">posted to USA BMX</div>
            <Toggle
              defaultChecked={this.state.tofuIsReady}
              icons={false}
              onChange={this.handleTofuChange} />
          </div>
        </div>
      </div>
  	);
  }
}

class LogBookPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { app, width, height } = this.props;

    return (
      <div className="logbook" style={{ width : `${width}px`, height : `${height}px` }}>
        <div className="header">
          <div className="btn ripple barcode"><FontAwesomeIcon icon={faBarcode} className="icon" /></div>
          <div className="btn ripple plus"><FontAwesomeIcon icon={faPlus} className="icon" /></div>
        </div>
        <div className="entries" style={{ height : `${height - 65 - 25}px` }}>
          <LogBookEntry width={width} height={height - 65 - 25 - 4 - 25}/>
        </div>
      </div>
  	);
  }
}

export default LogBookPanel;
