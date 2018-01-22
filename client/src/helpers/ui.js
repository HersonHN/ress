export default {

  scrollTo: function ($element, duration) {
    duration = duration || 300;

    let offset = $element.offset().top;

    let promise = $('html, body').animate({
      scrollTop: ($element.offset().top)
    }, duration);

  },

  highlight: function ($element) {
    $element.addClass('hilight-yellow');

    setTimeout(function () {
      $element.removeClass('hilight-yellow');
    }, 1200)
  }

}
