import 'index.scss';
import offset from 'document-offset';
import {groupBy, debounce} from 'underscore';

// Flatten one level deep arrays
function flatten(arr) {
  return Array.prototype.concat(...arr);
}

export default class EqualHeight {

  constructor({scope = document, debounce = 0} = {}) {
    // Set scope where to query elements from
    this.scope = scope;
    this.settings = {
      debounce: debounce
    };

    // Detect support
    this.detectSupport();

    // Run the main logic
    this.update();

    // Bind events
    this.bindEvents();
  }

  detectSupport() {
    this.IMAGES_LOADED_PLUGIN_ENABLED = typeof imagesLoaded !== 'undefined';
  }

  update({reset = false} = {}) {

    /**
     * Reset initial heights before calculating
     */
    if (reset) {
      Array.from(this.scope.querySelectorAll('[data-equal-height]')).forEach(item => {
        item.style.height = 'auto';
      })
    }

    // Create array of rows
    this.rows = this.getRows();

    // Create array of row items from the same group
    this.groupedRowItems = this.rows.map(row => {

      /*
      Check if the row has any grouped items inside.
      If not, just set the main element to equal heights.
       */
      const simpleRow = !row.filter(rowItem => {
        return (rowItem.element.querySelectorAll('[data-equal-height]').length != 0);
      }).length > 0;

      if (simpleRow) {
        return [row.map(rowItem => rowItem.element)];
      }

      return this.getGroups(row);
    });

    // Set height after images are loaded in a row
    if (this.IMAGES_LOADED_PLUGIN_ENABLED) {
      this.groupedRowItems.forEach(row => {
        row.forEach(rowItems => {
          let hasImages = false;
          rowItems.forEach(item => {
            if (item.querySelectorAll('img').length != 0) hasImages = true;
          });

          /*
            Enable imagesLoaded plugin, so we can check if all images of
            the same group are loaded before setting the equal height.
           */
          this.setHeight(rowItems);
          imagesLoaded(rowItems).on('done', () => {
            this.setHeight(rowItems);
          });
        });
      });
    } else {
      // Calculate tallest element from each row for the same group
      this.groupedRowItems.forEach(row => row.forEach(this.setHeight));
    }
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
            }))
          )
        ),
      ]

        .map((groupName) => {
          return row.map(rowItem => {
            // return an array from all the items in the same group
            return rowItem.element.querySelector(`[data-equal-height="${groupName}"]`);
          })
        })
    )

    // Strip items that are null to compensate for incorrect markup.
      .map(row => {
        return row.filter(items => {
          return (items !== null);
        })
      });
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
      this.update();
    };

    // Re-apply on resize
    window.addEventListener('resize', debounce(() => {
      this.update({reset: true});
    }, this.settings.debounce));

  }

}

new EqualHeight();
