export default {

  scrollTo: function ($element, duration) {
    duration = duration || 300;

    let offset = $element.offset().top;

    let promise = $('html, body').animate({
      scrollTop: offset
    }, duration);

    return promise;
  },

  highlight: function ($element) {
    $element.addClass('hilight-yellow');

    setTimeout(function () {
      $element.removeClass('hilight-yellow');
    }, 1200)
  }

}
