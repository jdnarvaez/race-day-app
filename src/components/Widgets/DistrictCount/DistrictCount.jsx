import React, { useContext, useState } from 'react';
import { Rnd } from 'react-rnd';

import USABMX from '../../../services/USABMX';

import '../Widget.css';
import './DistrictCount.css';

class DistrictCount extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      count : undefined,
      x : 100,
      y : innerHeight - 280,
      width : 275,
      height : 60
    }
  }

  componentDidMount() {
    USABMX.getTrackList().then((tracks) => {
      const districts = new Set(tracks.map(track => track.district));
      this.setState({ count : districts.size });
    })
  }

  render() {
    const { app, widgets } = this.props;
    const { x, y, width, height } = this.state;

    return (
      <Rnd
        className={`widget ${widgets.indexOf('DistrictCount') >= 0 ? 'show' : 'hide'} district-count`}
        size={{ width: width, height: height }}
        position={{ x: x, y: y }}
        onDragStop={(e, d) => {
          this.setState({ x : d.x, y : d.y })
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.setState({ x : position.x, y : position.y, width : Math.max(25, ref.style.width), height : Math.max(25, ref.style.height) })
        }}
      >
        <div className="close" onClick={(e) => app.setActiveTrack(undefined)}>&times;</div>
        <div className="layout">
          <div className="count">{this.state.count}</div>
          <div className="caption">districts</div>
        </div>
      </Rnd>
  	);
  }
}

export default DistrictCount;
