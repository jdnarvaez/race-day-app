import React from 'react';
import { render } from 'react-dom';
import { TransitionMotion, spring } from 'react-motion';

import './Input.css';

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: (props.locked && props.active) || false
    };
  }

  render() {
    const { active } = this.state;
    const { label, value, predicted, locked } = this.props;
    const fieldClassName = `field ${(locked ? active : active) && 'active'} ${locked && !active && 'locked'} ${value ? 'populated' : ''} ${this.props.className ? this.props.className : ''}`;

    return (
      <div className={fieldClassName} style={this.props.style}>
        {active &&
          value &&
          predicted &&
          predicted.includes(value) && <p className="predicted">{predicted}</p>}
        <input
          id={1}
          type={this.props.type || 'text'}
          value={value}
          placeholder={label}
          onChange={this.props.onChange}
          onKeyPress={this.props.onKeyPress}
          onFocus={() => !locked && this.setState({ active: true })}
          onBlur={() => !locked && this.setState({ active: false })}
        />
        <label htmlFor={1}>
          {label}
        </label>
      </div>
    );
  }
}

export default Input;
