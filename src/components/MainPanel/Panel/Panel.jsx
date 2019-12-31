import React from 'react';

import './Panel.css';

class Panel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div key={this.props.index.toString()} className={`panel ${this.props.activePanelIndex === this.props.index ? '' : (this.props.activePanelIndex < this.props.index ? 'right' : 'left')}`} style={this.props.style} >
        {this.props.children}
      </div>
  	);
  }
}

export default Panel;
