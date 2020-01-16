import React from 'react';

import './PointsClassSelector.css';

class PointsClassSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pointsClasses : [
        {
          name : 'No Points',
          id : 0,
        },
        {
          name : 'Single Point',
          id : 1,
        },
        {
          name : 'Double Points',
          id : 2,
        },
        {
          name : 'Triple Points',
          id : 3,
        },
        {
          name : 'Quadruple Points',
          id : 4,
        }
      ]
    }
  }

  selectPointsClass = (e, pointsClass) => {
    const { logBookEntry, onSelect } = this.props;
    logBookEntry.pointsClass = pointsClass;
    onSelect(e, logBookEntry);
  }

  render() {
    const { selectPointsClass } = this;
    const { app, width, height, logBookEntry } = this.props;
    const { pointsClasses } = this.state;

    return (
      <div className={`points-class-selector`} style={{ height : `${height}px` }}>
        <div className="points-classes" style={{ height : `${height - 50 - 45}px` }}>
          {pointsClasses.map(pointsClass => {
            return (
              <div className={`points-class ripple ${pointsClass.id === logBookEntry.pointsClass.id ? 'selected' : ''}`} key={pointsClass.id.toString()} onClick={(e) => selectPointsClass(e, pointsClass)}>
                <div className="name">{pointsClass.name}</div>
              </div>
            )
          })}
        </div>
      </div>
  	);
  }
}

export default PointsClassSelector;
