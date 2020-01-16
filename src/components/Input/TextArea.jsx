import React from 'react';
import { render } from 'react-dom';
import { TransitionMotion, spring } from 'react-motion';

import './TextArea.css';

class TextArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height : 'auto',
      active: (props.locked && props.active) || false
    };
  }

  changeValue(event) {
    const target = event.target;

    if (this.props.onChange) {
      this.props.onChange(event);

      clearTimeout(this.resizeTimeout);

      this.resizeTimeout = setTimeout(() => {
        this.setState({ height : 'auto' }, () => {
          this.setState({ height : `${target.scrollHeight}px` })
        })
      }, 100)
    }
  }

  handleKeyPress(event) {
    if (event.which === 13) {
      event.target.blur();
    }

    if (this.props.onKeyPress) {
      this.props.onKeyPress(event);
    }
  }

  render() {
    const { active, height } = this.state;
    const { label, value, predicted, locked } = this.props;
    const fieldClassName = `field ${(locked ? active : active) && 'active'} ${locked && !active && 'locked'} ${value ? 'populated' : ''} textarea-field`;

    return (
      <div className={fieldClassName}>
        {active &&
          value &&
          predicted &&
          predicted.includes(value) && <p className="predicted">{predicted}</p>}
        <textarea
          id={1}
          type={this.props.type || 'text'}
          value={value}
          placeholder={label}
          style={{ height : height }}
          onChange={this.changeValue.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
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

export default TextArea;
