import mini from './mini-jquery';

function scrollTo($element, duration) {
  duration = duration || 300;

  let offset = $element.offset().top;

  let promise = $('html, body').animate({
    scrollTop: offset
  }, duration);

  return promise;
}

function highlight(element) {
  mini.addClass(element, 'hilight-yellow');

  setTimeout(function () {
    mini.removeClass(element, 'hilight-yellow');
  }, 1200)
}

export default { scrollTo, highlight }
