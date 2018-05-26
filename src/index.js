import 'index.scss';
import offset from 'document-offset';
import {groupBy, debounce} from 'underscore';

// Flatten one level deep arrays
function flatten(arr) {
  return Array.prototype.concat(...arr);
}

export default class EqualHeight {
  constructor({scope = document} = {}) {
    // Set scope where to query elements from
    this.scope = scope;

    // Run the main logic
    this.calculate();

    // Bind events
    this.bindEvents();
  }

  calculate() {
    // Create array of rows
    this.rows = this.getRows();

    // Create array of row items from the same group
    this.groupedRowItems = this.rows.map((row) => {
      return this.getGroups(row);
    });

    // Calculate tallest element from each row for the same group
    this.groupedRowItems.forEach(row => row.forEach(this.setHeight));
  }

  /**
   * Apply heights on our row items
   */
  setHeight(items) {
    // Reset height, so we can calculate again
    items.forEach(item => {
      item.style.height = 'auto';
    });

    // Get tallest element
    const maxHeight = Math.max(...items.map(item => {
      return item.clientHeight;
    }));

    // Apply height to all elements in the group, on the same row.
    items.forEach(item => {
      item.style.height = maxHeight;
    })
  }

  /**
   * Get items from the same group in a row
   */
  getGroups(row) {
    return (
      [
        // Remove duplicate groupNames from array
        ...new Set(
          // Flatten one level deep arrays into one array.
          flatten(
            // Map over all the equalheight elements, so we can fetch all the different groups
            row.map(rowItem => Array.from(rowItem.element.querySelectorAll('[data-equal-height]')).map(element => {
              return element.dataset.equalHeight;
            })),
          )
        ),
      ].map((groupName) => {
        return row.map(rowItem => {
          // return an array from all the items in the same group
          return rowItem.element.querySelector(`[data-equal-height="${groupName}"]`);
        })
      })
    );
  }

  /**
   * Auto detect rows
   */
  getRows() {
    return Object.values(groupBy(
      Array.from(this.scope.querySelectorAll('.js-equal-height')).map(element => {
        // Get the top position (this is used to group the elements)
        return {element: element, top: offset(element).top};
      }), 'top'));
  }

  bindEvents() {
    // Re-apply on document loaded
    window.onload = () => {
      this.calculate();
    };

    // Re-apply on resize
    window.addEventListener('resize', debounce(() => {
      this.calculate();
    }, 150));
  }
}

new EqualHeight();
