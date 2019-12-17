import React, { useContext, useState } from 'react';
import { Rnd } from 'react-rnd';

import USABMX from '../../../services/USABMX';

import '../Widget.css';
import './TrackCount.css';

class TrackCount extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      count : undefined,
      x : 100,
      y : innerHeight - 85,
      width : 275,
      height : 60
    }
  }

  componentDidMount() {
    USABMX.getTrackList().then((tracks) => {
      this.setState({ count : tracks.length });
    })
  }

  render() {
    const { app, widgets } = this.props;
    const { x, y, width, height } = this.state;

    return (
      <Rnd
        className={`widget ${widgets.indexOf('TrackCount') >= 0 ? 'show' : 'hide'} track-count`}
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
          <div className="caption">tracks</div>
        </div>
      </Rnd>
  	);
  }
}

export default TrackCount;
