import React from 'react';

import './CategorySelector.css';

class CategorySelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories : ['Practice', 'Local', 'State', 'Gold Cup', 'National', 'Provincial Championship', 'Non-Riding Event']
    }
  }

  selectCategory = (e, category) => {
    const { logBookEntry, onSelect } = this.props;
    logBookEntry.category = category;
    onSelect(e, logBookEntry);
  }

  render() {
    const { selectCategory } = this;
    const { app, width, height, logBookEntry } = this.props;
    const { categories } = this.state;

    return (
      <div className={`category-selector`} style={{ height : `${height}px` }}>
        <div className="categories" style={{ height : `${height - 50 - 45}px` }}>
          {categories.map(category => {
            return (
              <div className={`category ripple ${category === logBookEntry.category ? 'selected' : ''}`} key={category} onClick={(e) => selectCategory(e, category)}>
                <div className="name">{category}</div>
              </div>
            )
          })}
        </div>
      </div>
  	);
  }
}

export default CategorySelector;
