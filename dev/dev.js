import './styles/index.scss';
import EqualHeights from '../src/index';

const equalHeights = new EqualHeights({debounce: 0, suppressWarnings: true});

document.querySelector('.js-refresh').addEventListener('click', (item) => {
  // Create a new event
  const event = new CustomEvent('equalheight:update');

  // Dispatch the event
  document.dispatchEvent(event);
});
