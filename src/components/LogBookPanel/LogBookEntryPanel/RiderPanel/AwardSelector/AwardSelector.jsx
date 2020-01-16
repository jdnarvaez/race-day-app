import React from 'react';
import MultiSwitch from 'react-multi-switch-toggle'

import './AwardSelector.css';

class AwardSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options : [
        'Certificate',
        'Ribbon',
        'Trophy',
        'Stamps'
      ]
    }
  }

  onToggle = (award) => {
    const { options } = this.state;
    const { updateLogBookEntry, entry } = this.props;
    entry.award = options[award];
    updateLogBookEntry();
  }

  render() {
    const { changeMotoNumber, changeMotoFinish, handleKeyPress } = this;
    const { logBookEntry, entry, width } = this.props;
    const { options } = this.state;
    const main = entry.motos.find(moto => moto.name === 'main');

    return (
      <div className={`award-selector ${main && main.finish !== '' ? 'show' : 'hide'}`}>
        <MultiSwitch
           texts={options}
           eachSwitchWidth={(width / 4) - 4}
           selectedSwitch={main && options.indexOf(main.award)}
           bgColor={'rgba(var(--background-color), 1)'}
           onToggleCallback={this.onToggle}
           fontColor={'rgba(var(--foreground-color), .5)'}
           selectedFontColor={'rgba(var(--active-color), 1)'}
           selectedSwitchColor={'rgba(var(--background-color), 1)'}
           borderColor={'rgba(var(--background-color), 1)'}
           borderWidth={'1px'}
           height={'35px'}
           fontSize={'14px'}
           fontWeight={'100'}
         />
      </div>
  	);
  }
}

export default AwardSelector;
