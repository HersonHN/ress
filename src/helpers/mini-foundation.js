
import $ from './mini-jquery';

const TYPES = [{
  id: 'off-canvas',
  typeQuery: '[data-off-canvas]',
  self: {
    active:   { 'class': 'is-open',   attrs: { 'aria-hidden': 'false' } },
    inactive: { 'class': 'is-closed', attrs: { 'aria-hidden': 'true' } },
  },
  other: [{
    query: '[data-off-canvas-content]',
    active: { 'class': 'has-transition-push' },
    inactive: {},
  }],
  variations: [{
    variationQuery: '[data-position=left]',
    other: [{
      query: '[data-off-canvas-content]',
      active: { 'class': ['has-position-left', 'is-open-left'] },
      inactive: {},
    }]
  }],
  create: {
    sibling: {
      tag: 'div',
      original: { 'class': ['js-off-canvas-overlay', 'is-overlay-fixed'] },
      active: { 'class': ['is-visible', 'is-closable'] },
      inactive: {}
    }
  }
}]

function init(parent) {
  // search for all controls
  activateControls(parent);
}


function activateControls(parent) {

  let $controls = $.find('[data-open]', parent);
  console.log('$controls', $controls);

  $controls.forEach(function (source) {
    let targetId = source.getAttribute('data-open');
    let target = $.id(targetId);
    setup(source, target);
  });

}

function setup(source, target) {
  let type = getType(target);

  // @HERE
}

function getType(target) {
  let conf;

  TYPES.forEach((type) => {
    let query = type.typeQuery;
    if ($.is(target, query)) {
      conf = type;
      return -1;
    }
  });

  return conf;
}

export default { init };
