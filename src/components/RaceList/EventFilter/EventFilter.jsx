import React from 'react';
import './EventFilter.css';

class EventFilter extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { toggleFilter, filter, options } = this.props;

    return (
      <div className={`filter ${filter.replace(' ', '')} ${options.indexOf(filter) >= 0 ? 'active' : 'inactive' }`} onClick={(e) => toggleFilter(filter)}>{filter}</div>
  	);
  }
}

export default EventFilter;
