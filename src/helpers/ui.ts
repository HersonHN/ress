import { addClass, removeClass } from './mini-jquery';

function scrollTo(element: HTMLElement) {
  element.scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
}

function highlight(element: HTMLElement) {
  addClass(element, 'hilight-yellow');

  setTimeout(function () {
    removeClass(element, 'hilight-yellow');
  }, 1200);
}

export default { scrollTo, highlight };
