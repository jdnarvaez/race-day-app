import React, { useContext, useState } from 'react';
import { Rnd } from 'react-rnd';

import USABMX from '../../../services/USABMX';

import '../Widget.css';
import './NationalCount.css';

class NationalCount extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      count : undefined,
      x : 100,
      y : innerHeight - 150,
      width : 275,
      height : 60
    }
  }

  componentDidMount() {
    USABMX.getRaceList().then((races) => {
      const nationals = races.filter((race) => race.category === 'National');
      this.setState({ count : nationals.length });
    })
  }

  render() {
    const { app, widgets } = this.props;
    const { x, y, width, height } = this.state;

    return (
      <Rnd
        className={`widget ${widgets.indexOf('NationalCount') >= 0 ? 'show' : 'hide'} national-count`}
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
          <div className="caption">nationals</div>
        </div>
      </Rnd>
  	);
  }
}

export default NationalCount;
