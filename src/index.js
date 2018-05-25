import 'index.scss';
import offset from 'document-offset';
import {groupBy} from 'underscore';

function flatten(arr) {
  return Array.prototype.concat(...arr);
}

export default class EqualHeight {
  constructor({scope = document} = {}) {
    // Set scope where to query elements from
    this.scope = scope;

    // Query all elements with the same group name
    this.groups = this.getGroups();

    // Create array of rows
    this.rows = this.getRows();

    this.rows.forEach(rowItem => {
      if (rowItem.length === 1) return;

    })
  }

  /**
   * Get items from the same group
   */
  getGroups() {
    return (
      [
        // Remove duplicates from array
        ...new Set(
          Array.from(this.scope.querySelectorAll('[data-equal-height]')).map(item => {
            return item.dataset.equalHeight;
          }),
        ),
      ]
      // Return all items within a group
        .map(item => this.scope.querySelectorAll(`[data-equal-height="${item}"]`))
    );
  }

  /**
   * Auto detect rows
   */
  getRows() {
    return flatten(
      // Loop over groups
      this.groups.map(group => {
        // Get values of objects
        const grouped = Object.values(
          // Group items to rows
          groupBy(
            Array.from(group).map(item => {
              // Get the top position (this is used to group the items)
              return {item: item, top: offset(item).top};
            }),
            'top',
          ),
        );
        return grouped;
      }),
    );
  }

  bindEvents() {
  }
}
