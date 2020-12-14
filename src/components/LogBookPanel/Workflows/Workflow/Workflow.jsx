import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import MainPanel from '../../../MainPanel';

import './Workflow.css';

class Workflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  headerTitle = () => {
    const { panelNames } = this.props;
    const { activePanelIndex } = this.state;
    return panelNames[activePanelIndex] || '';
  }

  render() {
    const { headerTitle } = this;
    const { app, width, height, show, onBack, onForward, activePanelIndex } = this.props;

    return (
      <div className={`workflow ${this.props.show ? 'show' : ''}`} style={{ width : `${width}px`, height : `${height}px` }}>
        <div className="header">
          <div className="btn ripple" onClick={(e) => { e.target.blur(); onBack() }} ><FontAwesomeIcon icon={activePanelIndex === 0 ? faTimes : faChevronLeft} /></div>
          <div className="title">{headerTitle()}</div>
          <div className="btn right ripple" onClick={(e) => { e.target.blur(); onForward() }} ><FontAwesomeIcon icon={faChevronRight} /></div>
        </div>
        <MainPanel activePanelIndex={activePanelIndex} width={width} height={height - 65}>
          {this.props.panels}
        </MainPanel>
      </div>
  	);
  }
}

export default Workflow;
