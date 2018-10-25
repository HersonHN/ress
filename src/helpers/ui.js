import mini from './mini-jquery';

function scrollTo(element, duration) {
  duration = duration || 300;
  let top = element.offsetTop;

  let scrollStep = -window.scrollY / (duration / 15);
  let scrollInterval = setInterval(function () {
      
      if (window.scrollY > top) {
        window.scrollBy(top, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
  }, 15);

}

function highlight(element) {
  mini.addClass(element, 'hilight-yellow');

  setTimeout(function () {
    mini.removeClass(element, 'hilight-yellow');
  }, 1200)
}

export default { scrollTo, highlight }
