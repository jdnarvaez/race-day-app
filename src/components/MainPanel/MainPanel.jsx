import React from 'react';

import Panel from './Panel';

import './MainPanel.css';

class MainPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { width, height } = this.props;
    const style = { width : `${width}px`, height : `${height}px` };

    return (
      <div className={`main-panel`} style={style}>
        {React.Children.map(this.props.children, (child, idx) => {
          const props = {...child.props};
          props.width = width;
          props.height = height;
          props.activePanel = this.props.activePanelIndex === idx;

          return (
            <Panel index={idx} key={idx.toString()} activePanelIndex={this.props.activePanelIndex} width={this.props.width} height={this.props.height} style={style}>
              {React.cloneElement(child, props)}
            </Panel>
          )})}
      </div>
  	);
  }
}

export default MainPanel;
