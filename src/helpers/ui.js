import mini from './mini-jquery';

function scrollTo(element) {
  element.scrollIntoView({ 
    block: 'start',
    behavior: 'smooth'
  });
}

function highlight(element) {
  mini.addClass(element, 'hilight-yellow');

  setTimeout(function () {
    mini.removeClass(element, 'hilight-yellow');
  }, 1200)
}

export default { scrollTo, highlight }
